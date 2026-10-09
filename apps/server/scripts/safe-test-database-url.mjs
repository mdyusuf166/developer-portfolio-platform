const approvedProtocols = new Set(['postgres:', 'postgresql:']);

export function validateSafeTestDatabaseUrl(rawUrl) {
  let databaseUrl;
  let decodedUsername;
  let decodedPassword;

  try {
    databaseUrl = new URL(rawUrl);
    decodedUsername = decodeURIComponent(databaseUrl.username);
    decodedPassword = decodeURIComponent(databaseUrl.password);
  } catch {
    throw new Error('PORTFOLIO_TEST_DATABASE_URL must be a valid PostgreSQL URL for the approved disposable database.');
  }

  let databaseName;
  try {
    databaseName = decodeURIComponent(databaseUrl.pathname.slice(1));
  } catch {
    throw new Error('PORTFOLIO_TEST_DATABASE_URL must target the approved disposable database.');
  }

  if (
    rawUrl !== databaseUrl.href ||
    rawUrl.includes('?') ||
    rawUrl.includes('#') ||
    !approvedProtocols.has(databaseUrl.protocol) ||
    decodedUsername !== 'portfolio_test' ||
    !decodedPassword ||
    databaseUrl.hostname !== '127.0.0.1' ||
    databaseUrl.port !== '55432' ||
    databaseUrl.pathname !== '/portfolio_test_phase3b0' ||
    databaseName !== 'portfolio_test_phase3b0' ||
    databaseUrl.search !== '' ||
    databaseUrl.hash !== ''
  ) {
    throw new Error('PORTFOLIO_TEST_DATABASE_URL must target the approved disposable database at 127.0.0.1:55432.');
  }

  return databaseUrl;
}
