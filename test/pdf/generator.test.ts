import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

import type { Browser } from 'playwright';

import type { BrowserFactory } from '../../src/pdf/generator.ts';
import { generatePdf } from '../../src/pdf/generator.ts';
import { getPdfOptions } from '../../src/pdf/options.ts';

interface MockPage {
  setViewportSize: ReturnType<typeof mock.fn>;
  setContent: ReturnType<typeof mock.fn>;
  evaluate: ReturnType<typeof mock.fn>;
  pdf: ReturnType<typeof mock.fn>;
}

interface MockBrowser {
  newPage: ReturnType<typeof mock.fn>;
  close: ReturnType<typeof mock.fn>;
}

interface MockBrowserFactoryFn {
  launch: ReturnType<typeof mock.fn>;
}

interface GeneratedOptions {
  path?: string;
  format?: 'A4';
  printBackground?: boolean;
  margin?: { top: string; right: string; bottom: string; left: string };
}

describe('pdf/generator.ts', () => {
  describe('generatePdf', () => {
    it('generates PDF with correct options', async () => {
      let generatedPath = '';
      let generatedOptions: GeneratedOptions | null = null;
      let setContentHtml = '';

      const mockPage: MockPage = {
        setViewportSize: mock.fn(async () => {}),
        setContent: mock.fn(async (html: string) => {
          setContentHtml = html;
        }),
        evaluate: mock.fn(async () => 1000),
        pdf: mock.fn(async (options: GeneratedOptions) => {
          generatedPath = options.path ?? '';
          generatedOptions = options;
        }),
      };

      const mockBrowser: MockBrowser = {
        newPage: mock.fn(async () => mockPage),
        close: mock.fn(async () => {}),
      };

      const browserFactory: MockBrowserFactoryFn = {
        launch: mock.fn(async () => mockBrowser as unknown as Browser),
      };

      const html = '<html><body><div class="a4-page">Test</div></body></html>';
      const outputPath = '/tmp/test.pdf';
      const options = getPdfOptions();

      await generatePdf(html, outputPath, options, browserFactory as unknown as BrowserFactory);

      assert.strictEqual(browserFactory.launch.mock.callCount(), 1);
      assert.strictEqual(mockBrowser.newPage.mock.callCount(), 1);
      assert.strictEqual(mockPage.setViewportSize.mock.callCount(), 1);
      assert.strictEqual(mockPage.setContent.mock.callCount(), 1);
      assert.strictEqual(mockPage.evaluate.mock.callCount(), 2);
      assert.strictEqual(mockPage.pdf.mock.callCount(), 1);
      assert.strictEqual(mockBrowser.close.mock.callCount(), 1);

      assert.strictEqual(generatedPath, outputPath);
      assert.match(setContentHtml, /<base\s+href=/i);
      const opts = generatedOptions as unknown as GeneratedOptions;
      assert.strictEqual(opts.format, 'A4');
      assert.strictEqual(opts.printBackground, true);
      assert.deepStrictEqual(opts.margin, {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      });

      mock.restoreAll();
    });
  });
});
