import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rawTestUrl = process.env.PORTFOLIO_TEST_DATABASE_URL;
if (!rawTestUrl || process.env.PORTFOLIO_TEST_DATABASE_IS_DISPOSABLE !== '1') {
  console.error('Server tests require PORTFOLIO_TEST_DATABASE_URL and explicit confirmation that it is disposable.');
  process.exit(2);
}

let testDatabase;
try {
  testDatabase = new URL(rawTestUrl);
} catch {
  console.error('PORTFOLIO_TEST_DATABASE_URL must be a valid PostgreSQL URL.');
  process.exit(2);
}
const databaseName = decodeURIComponent(testDatabase.pathname.slice(1));
if (!['postgres:', 'postgresql:'].includes(testDatabase.protocol) || !['localhost', '127.0.0.1', '::1', '[::1]'].includes(testDatabase.hostname) || !databaseName.startsWith('portfolio_test_')) {
  console.error('Server tests are restricted to a loopback database named portfolio_test_*.');
  process.exit(2);
}

const uploadDirectory = await mkdtemp(resolve(tmpdir(), 'portfolio-test-uploads-'));
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const vitestCli = resolve(scriptDirectory, '../../../node_modules/vitest/vitest.mjs');
const child = spawn(process.execPath, [vitestCli, 'run', ...process.argv.slice(2)], {
  cwd: resolve(scriptDirectory, '..'),
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'test',
    DATABASE_URL: rawTestUrl,
    UPLOADS_DIR: uploadDirectory
  }
});

let exitCode = 1;
try {
  const result = await new Promise((resolveResult, reject) => {
    child.once('error', reject);
    child.once('exit', (code, signal) => resolveResult({ code, signal }));
  });
  exitCode = result.code ?? 1;
  if (result.signal) console.error(`Test process terminated by ${result.signal}.`);
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
