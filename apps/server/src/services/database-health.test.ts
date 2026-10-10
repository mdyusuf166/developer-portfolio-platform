import { describe, expect, it } from 'vitest';

import { getDatabaseHealth } from './database-health.js';

describe('database foundation service', () => {
  it('returns the correct database health payload shape', async () => {
    const result = await getDatabaseHealth();

    expect(result).toMatchObject({
      provider: 'postgresql'
    });
    expect(['configured', 'ok', 'unavailable']).toContain(result.status);
  });
});
