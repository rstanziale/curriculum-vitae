import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { DEFAULT_TAG, getCvTag } from '../../src/config/tag.ts';

describe('config/tag.ts', () => {
  describe('getCvTag', () => {
    it('returns CV_TAG when set', () => {
      assert.strictEqual(getCvTag({ CV_TAG: 'v1.0.0' }), 'v1.0.0');
    });

    it('returns custom tag verbatim (free-form)', () => {
      assert.strictEqual(getCvTag({ CV_TAG: 'release-candidate' }), 'release-candidate');
    });

    it('trims whitespace', () => {
      assert.strictEqual(getCvTag({ CV_TAG: '  v2.0  ' }), 'v2.0');
    });

    it('returns default "test" when CV_TAG absent', () => {
      assert.strictEqual(getCvTag({}), 'test');
      assert.strictEqual(getCvTag({}), DEFAULT_TAG);
    });

    it('returns default "test" when CV_TAG is empty string', () => {
      assert.strictEqual(getCvTag({ CV_TAG: '' }), 'test');
    });

    it('returns default "test" when CV_TAG is whitespace only', () => {
      assert.strictEqual(getCvTag({ CV_TAG: '   ' }), 'test');
    });

    it('returns default "test" when CV_TAG is undefined', () => {
      assert.strictEqual(getCvTag({ CV_TAG: undefined }), 'test');
    });

    it('uses process.env by default', () => {
      const original = process.env.CV_TAG;
      try {
        process.env.CV_TAG = 'from-env';
        assert.strictEqual(getCvTag(), 'from-env');
        delete process.env.CV_TAG;
        assert.strictEqual(getCvTag(), 'test');
      } finally {
        if (original === undefined) delete process.env.CV_TAG;
        else process.env.CV_TAG = original;
      }
    });
  });
});
