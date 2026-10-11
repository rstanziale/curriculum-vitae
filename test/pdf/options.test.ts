import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  FOOTER_HEIGHT_MM,
  getPdfOptions,
  PAGE_MARGIN_MM,
  type PdfFilter,
} from '../../src/pdf/options.ts';

describe('pdf/options.ts', () => {
  describe('getPdfOptions', () => {
    it('returns page options without a footer', () => {
      const options = getPdfOptions();

      assert.strictEqual(options.format, 'A4');
      assert.strictEqual(options.printBackground, true);
      assert.strictEqual(options.displayHeaderFooter, undefined);
      assert.strictEqual(options.headerTemplate, undefined);
      assert.strictEqual(options.footerTemplate, undefined);
      assert.deepStrictEqual(options.margin, {
        top: `${PAGE_MARGIN_MM}mm`,
        right: `${PAGE_MARGIN_MM}mm`,
        bottom: `${PAGE_MARGIN_MM}mm`,
        left: `${PAGE_MARGIN_MM}mm`,
      });
    });

    it('reserves footer space when a footer template is enabled', () => {
      const filter: PdfFilter = {
        withFooter: true,
        footerTemplate: '<div class="cv-footer">Consent</div>',
      };
      const options = getPdfOptions(filter);

      assert.strictEqual(options.displayHeaderFooter, true);
      assert.strictEqual(options.headerTemplate, '<div></div>');
      assert.strictEqual(options.footerTemplate, filter.footerTemplate);
      assert.deepStrictEqual(options.margin, {
        top: `${PAGE_MARGIN_MM}mm`,
        right: `${PAGE_MARGIN_MM}mm`,
        bottom: `${PAGE_MARGIN_MM + FOOTER_HEIGHT_MM}mm`,
        left: `${PAGE_MARGIN_MM}mm`,
      });
    });

    it('does not enable footer space when the filter disables the footer', () => {
      const filter: PdfFilter = {
        withFooter: false,
        footerTemplate: '<div class="cv-footer">Unused</div>',
      };
      const options = getPdfOptions(filter);

      assert.strictEqual(options.displayHeaderFooter, undefined);
      assert.strictEqual(options.footerTemplate, undefined);
      assert.deepStrictEqual(options.margin, {
        top: `${PAGE_MARGIN_MM}mm`,
        right: `${PAGE_MARGIN_MM}mm`,
        bottom: `${PAGE_MARGIN_MM}mm`,
        left: `${PAGE_MARGIN_MM}mm`,
      });
    });

    it('does not enable footer space without a footer template', () => {
      const options = getPdfOptions({ withFooter: true });

      assert.strictEqual(options.displayHeaderFooter, undefined);
      assert.strictEqual(options.footerTemplate, undefined);
      assert.strictEqual(options.margin.bottom, `${PAGE_MARGIN_MM}mm`);
    });
  });
});
