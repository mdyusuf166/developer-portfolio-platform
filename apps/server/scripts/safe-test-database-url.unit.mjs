import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateSafeTestDatabaseUrl } from './safe-test-database-url.mjs';

describe('validateSafeTestDatabaseUrl', () => {
  it('accepts the approved PostgreSQL URL', () => {
    assert.doesNotThrow(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio_test:test_password@127.0.0.1:55432/portfolio_test_phase3b0')
    );
  });

  it('accepts the postgres protocol alias', () => {
    assert.doesNotThrow(() =>
      validateSafeTestDatabaseUrl('postgres://portfolio_test:test_password@127.0.0.1:55432/portfolio_test_phase3b0')
    );
  });

  it('accepts valid percent-encoded credentials with the approved decoded username', () => {
    assert.doesNotThrow(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio%5Ftest:pass%40word@127.0.0.1:55432/portfolio_test_phase3b0')
    );
  });

  it('rejects port 5432 and other ports', () => {
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio_test:test_password@127.0.0.1:5432/portfolio_test_phase3b0')
    );
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio_test:test_password@127.0.0.1:55433/portfolio_test_phase3b0')
    );
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio_test:test_password@127.0.0.1/portfolio_test_phase3b0')
    );
  });

  it('rejects devportfolio and all other database names', () => {
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio_test:test_password@127.0.0.1:55432/devportfolio')
    );
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio_test:test_password@127.0.0.1:55432/portfolio_test_other')
    );
  });

  it('rejects hosts other than the approved IPv4 loopback address', () => {
    for (const authority of ['localhost', '127.0.0.2', '[::1]', 'db.example.test']) {
      assert.throws(() =>
        validateSafeTestDatabaseUrl(`postgresql://portfolio_test:test_password@${authority}:55432/portfolio_test_phase3b0`)
      );
    }
  });

  it('rejects missing usernames or passwords', () => {
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://:test_password@127.0.0.1:55432/portfolio_test_phase3b0')
    );
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio_test@127.0.0.1:55432/portfolio_test_phase3b0')
    );
  });

  it('rejects malformed URLs and non-PostgreSQL protocols', () => {
    assert.throws(() => validateSafeTestDatabaseUrl('not a URL'));
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio_test%ZZ:test_password@127.0.0.1:55432/portfolio_test_phase3b0')
    );
    assert.throws(() =>
      validateSafeTestDatabaseUrl('mysql://portfolio_test:test_password@127.0.0.1:55432/portfolio_test_phase3b0')
    );
  });

  it('rejects query or fragment values that could alter connection handling', () => {
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio_test:test_password@127.0.0.1:55432/portfolio_test_phase3b0?host=ai-postgres')
    );
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio_test:test_password@127.0.0.1:55432/portfolio_test_phase3b0#other')
    );
  });

  it('rejects a different decoded username', () => {
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://other_user:test_password@127.0.0.1:55432/portfolio_test_phase3b0')
    );
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio%5Ftestx:test_password@127.0.0.1:55432/portfolio_test_phase3b0')
    );
  });

  it('rejects host spellings and URL serialization that are normalized by URL', () => {
    for (const authority of ['127.1', '0x7f000001', '2130706433', '[::ffff:127.0.0.1]']) {
      assert.throws(() =>
        validateSafeTestDatabaseUrl(`postgresql://portfolio_test:test_password@${authority}:55432/portfolio_test_phase3b0`)
      );
    }
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio_test:test_password@127.0.0.1:55432')
    );
  });

  it('rejects empty query and fragment delimiters', () => {
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio_test:test_password@127.0.0.1:55432/portfolio_test_phase3b0?')
    );
    assert.throws(() =>
      validateSafeTestDatabaseUrl('postgresql://portfolio_test:test_password@127.0.0.1:55432/portfolio_test_phase3b0#')
    );
  });

  it('uses a fixed generic error for malformed credential encodings', () => {
    assert.throws(
      () => validateSafeTestDatabaseUrl('postgresql://portfolio_test:pass%ZZ@127.0.0.1:55432/portfolio_test_phase3b0'),
      { message: 'PORTFOLIO_TEST_DATABASE_URL must be a valid PostgreSQL URL for the approved disposable database.' }
    );
  });
});
