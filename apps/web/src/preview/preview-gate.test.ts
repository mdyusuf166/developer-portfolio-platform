import { describe, expect, it } from 'vitest';

import { isPreviewEntryEnabled } from './preview-gate';

describe('preview entry gate', () => {
  it('allows the exact preview path and its child routes only in development', () => {
    expect(isPreviewEntryEnabled(true, '/__preview')).toBe(true);
    expect(isPreviewEntryEnabled(true, '/__preview/projects/sample-document-explorer')).toBe(true);
  });

  it('does not activate in production or on similarly prefixed paths', () => {
    expect(isPreviewEntryEnabled(false, '/__preview')).toBe(false);
    expect(isPreviewEntryEnabled(false, '/__preview/projects')).toBe(false);
    expect(isPreviewEntryEnabled(true, '/__previewer')).toBe(false);
  });
});
