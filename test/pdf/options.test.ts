import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getPdfOptions } from '../../src/pdf/options.ts';

describe('pdf/options.ts', () => {
  describe('getPdfOptions', () => {
    it('returns correct PDF options', () => {
      const options = getPdfOptions();

      assert.strictEqual(options.format, 'A4');
      assert.strictEqual(options.printBackground, true);
      assert.deepStrictEqual(options.margin, {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      });
    });
  });
});
