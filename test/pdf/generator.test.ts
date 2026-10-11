import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

import type { Browser } from 'playwright';

import type { BrowserFactory } from '../../src/pdf/generator.ts';
import { generatePdf } from '../../src/pdf/generator.ts';
import { FOOTER_HEIGHT_MM, getPdfOptions, PAGE_MARGIN_MM } from '../../src/pdf/options.ts';

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
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
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

      const html =
        '<html><head><style>:root { --page-margin: 20mm; }</style></head><body><div class="a4-page">Test</div></body></html>';
      const outputPath = '/tmp/test.pdf';
      const options = getPdfOptions({
        withFooter: true,
        footerTemplate:
          "<style>@font-face{src:url('../assets/fonts/Montserrat-Regular.ttf')}</style><div>Consent</div>",
      });

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
      const expectedMargin = `${PAGE_MARGIN_MM}mm ${PAGE_MARGIN_MM}mm ${PAGE_MARGIN_MM + FOOTER_HEIGHT_MM}mm ${PAGE_MARGIN_MM}mm`;
      assert.match(setContentHtml, new RegExp(`--page-margin:\\s*${expectedMargin};`));
      const opts = generatedOptions as unknown as GeneratedOptions;
      assert.strictEqual(opts.format, 'A4');
      assert.strictEqual(opts.printBackground, true);
      assert.strictEqual(opts.displayHeaderFooter, true);
      assert.strictEqual(opts.headerTemplate, '<div></div>');
      assert.match(opts.footerTemplate ?? '', /data:font\/truetype;base64,/);
      assert.match(opts.footerTemplate ?? '', /<div>Consent<\/div>/);
      assert.deepStrictEqual(opts.margin, {
        top: `${PAGE_MARGIN_MM}mm`,
        right: `${PAGE_MARGIN_MM}mm`,
        bottom: `${PAGE_MARGIN_MM + FOOTER_HEIGHT_MM}mm`,
        left: `${PAGE_MARGIN_MM}mm`,
      });

      mock.restoreAll();
    });
  });
});
