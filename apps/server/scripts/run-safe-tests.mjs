import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSafeTestDatabaseUrl } from './safe-test-database-url.mjs';

const approvedTestFiles = new Set([
  'src/__tests__/auth.test.ts',
  'src/__tests__/admin-crud.test.ts',
  'src/__tests__/phase11-query.test.ts'
]);
if (process.argv.length !== 3 || !approvedTestFiles.has(process.argv[2])) {
  console.error('Pass exactly one approved integration-test file.');
  process.exit(2);
}

const rawTestUrl = process.env.PORTFOLIO_TEST_DATABASE_URL;
if (!rawTestUrl || process.env.PORTFOLIO_TEST_DATABASE_IS_DISPOSABLE !== '1') {
  console.error('Server tests require PORTFOLIO_TEST_DATABASE_URL and explicit confirmation that it is disposable.');
  process.exit(2);
}

let validatedDatabaseUrl;
try {
  validatedDatabaseUrl = validateSafeTestDatabaseUrl(rawTestUrl);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}

const uploadDirectory = await mkdtemp(resolve(tmpdir(), 'portfolio-test-uploads-'));
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const vitestCli = resolve(scriptDirectory, '../../../node_modules/vitest/vitest.mjs');
const maxOutputBytes = 1024 * 1024;
const decodedPassword = decodeURIComponent(validatedDatabaseUrl.password);
const encodedPassword = encodeURIComponent(decodedPassword);
const redactions = new Set([
  rawTestUrl,
  validatedDatabaseUrl.href,
  decodedPassword,
  encodedPassword,
  encodedPassword.replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`),
  encodedPassword.replace(/%[0-9A-F]{2}/g, (sequence) => sequence.toLowerCase())
].filter(Boolean));
const redact = (output) => {
  let safeOutput = output;
  for (const secret of [...redactions].sort((left, right) => right.length - left.length)) {
    safeOutput = safeOutput.replaceAll(secret, '[REDACTED]');
  }
  return safeOutput;
};
const child = spawn(process.execPath, [vitestCli, 'run', process.argv[2]], {
  cwd: resolve(scriptDirectory, '..'),
  stdio: ['ignore', 'pipe', 'pipe'],
  env: {
    ...process.env,
    NODE_ENV: 'test',
    DATABASE_URL: rawTestUrl,
    UPLOADS_DIR: uploadDirectory
  }
});

let exitCode = 1;
const output = {
  stdout: [],
  stderr: [],
  stdoutBytes: 0,
  stderrBytes: 0,
  stdoutTruncated: false,
  stderrTruncated: false
};
let spawnError;
let killTimer;
const stopForOutputLimit = () => {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill('SIGTERM');
  killTimer = setTimeout(() => child.kill('SIGKILL'), 1000);
  killTimer.unref();
};
const capture = (stream, name) => {
  stream.on('data', (chunk) => {
    const chunks = output[name];
    const bytesKey = `${name}Bytes`;
    const truncatedKey = `${name}Truncated`;
    if (output[truncatedKey]) return;
    const remainingBytes = maxOutputBytes - output[bytesKey];
    if (chunk.length > remainingBytes) {
      chunks.length = 0;
      output[truncatedKey] = true;
      stopForOutputLimit();
      return;
    }
    output[bytesKey] += chunk.length;
    chunks.push(chunk);
  });
};
capture(child.stdout, 'stdout');
capture(child.stderr, 'stderr');
try {
  const result = await new Promise((resolveResult) => {
    child.once('error', (error) => { spawnError = error; });
    child.once('close', (code, signal) => resolveResult({ code, signal }));
  });
  if (killTimer) clearTimeout(killTimer);
  const stdout = redact(Buffer.concat(output.stdout).toString('utf8'));
  const stderr = redact(Buffer.concat(output.stderr).toString('utf8'));
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
  if (spawnError) {
    console.error(`Unable to start the test process${spawnError.code ? ` (${spawnError.code})` : ''}.`);
  }
  if (output.stdoutTruncated) console.error('stdout exceeded its output limit; captured output was discarded.');
  if (output.stderrTruncated) console.error('stderr exceeded its output limit; captured output was discarded.');
  exitCode = result.code ?? 1;
  if (result.signal) console.error(`Test process terminated by ${result.signal}.`);
  if (spawnError || output.stdoutTruncated || output.stderrTruncated) exitCode = 1;
} finally {
  const resolvedTempRoot = resolve(tmpdir());
  const resolvedUploadDirectory = resolve(uploadDirectory);
  if (!resolvedUploadDirectory.startsWith(`${resolvedTempRoot}/`) && !resolvedUploadDirectory.startsWith(`${resolvedTempRoot}\\`)) {
    console.error('Refusing to remove an upload test directory outside the OS temp directory.');
    exitCode = 1;
  } else {
    await rm(resolvedUploadDirectory, { recursive: true, force: true });
  }
}
process.exitCode = exitCode;
