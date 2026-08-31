import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

import { checkPageHeight } from '../../src/pdf/viewport.ts';

interface MockPage {
  evaluate: () => Promise<number>;
}

describe('pdf/viewport.ts', () => {
  describe('checkPageHeight', () => {
    it('logs warning when content exceeds max height', async () => {
      const consoleWarn = mock.method(console, 'warn');
      const consoleLog = mock.method(console, 'log');

      const mockPage: MockPage = {
        evaluate: async () => 1200,
      };

      await checkPageHeight(mockPage, 1123);

      assert.strictEqual(consoleWarn.mock.callCount(), 1);
      assert.ok(consoleWarn.mock.calls[0].arguments[0].includes('WARNING'));
      assert.ok(consoleWarn.mock.calls[0].arguments[0].includes('1200px'));
      assert.strictEqual(consoleLog.mock.callCount(), 0);

      mock.restoreAll();
    });

    it('logs success when content fits within max height', async () => {
      const consoleWarn = mock.method(console, 'warn');
      const consoleLog = mock.method(console, 'log');

      const mockPage: MockPage = {
        evaluate: async () => 1000,
      };

      await checkPageHeight(mockPage, 1123);

      assert.strictEqual(consoleLog.mock.callCount(), 1);
      assert.ok(consoleLog.mock.calls[0].arguments[0].includes('Page size check passed'));
      assert.strictEqual(consoleWarn.mock.callCount(), 0);

      mock.restoreAll();
    });

    it('handles zero height', async () => {
      const consoleLog = mock.method(console, 'log');

      const mockPage: MockPage = {
        evaluate: async () => 0,
      };

      await checkPageHeight(mockPage, 1123);

      assert.strictEqual(consoleLog.mock.callCount(), 1);
      mock.restoreAll();
    });
  });
});
