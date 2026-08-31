import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { before, describe, it } from 'node:test';

import { PDFParse } from 'pdf-parse';

import { getCvTag } from '../src/config/tag.ts';

const tag = getCvTag();
const outputDir = path.resolve('./dist');
const cvItaData = JSON.parse(await fs.readFile('./data/cv.ita.json', 'utf8')) as {
  personalInfo: { surname: string };
};
const expectedSurname = cvItaData.personalInfo.surname;

describe('CV Integration Tests', () => {
  before(async () => {
    execSync(`node src/index.ts`, {
      stdio: 'pipe',
    });
  });

  describe('ITA version', () => {
    const pdfPath = path.join(outputDir, `CV_RBS_ITA-${tag}.pdf`);

    it('PDF file should be generated', async () => {
      await assert.doesNotThrow(() => fs.access(pdfPath), `PDF file not found at ${pdfPath}`);
    });

    it('PDF should not exceed 2 pages', async () => {
      const pdfBuffer = await fs.readFile(pdfPath);
      const parser = new PDFParse({ data: pdfBuffer });
      const pdfData = await parser.getInfo();
      await parser.destroy();

      assert.ok(pdfData.total <= 2, `CV exceeds page limit! Current pages: ${pdfData.total}`);
    });

    it(`PDF should contain the surname ${expectedSurname}`, async () => {
      const pdfBuffer = await fs.readFile(pdfPath);
      const parser = new PDFParse({ data: pdfBuffer });
      const pdfData = await parser.getText();
      await parser.destroy();

      assert.match(
        pdfData.text,
        new RegExp(expectedSurname),
        `Surname ${expectedSurname} not found in PDF text`
      );
    });
  });

  describe('ENG version', () => {
    const pdfPath = path.join(outputDir, `CV_RBS_ENG-${tag}.pdf`);

    it('PDF file should be generated', async () => {
      await assert.doesNotThrow(() => fs.access(pdfPath), `PDF file not found at ${pdfPath}`);
    });

    it('PDF should contain exactly 1 page', async () => {
      const pdfBuffer = await fs.readFile(pdfPath);
      const parser = new PDFParse({ data: pdfBuffer });
      const pdfData = await parser.getInfo();
      await parser.destroy();

      assert.strictEqual(
        pdfData.total,
        1,
        `CV exceeds page limit! Current pages: ${pdfData.total}`
      );
    });

    it(`PDF should contain the surname ${expectedSurname}`, async () => {
      const pdfBuffer = await fs.readFile(pdfPath);
      const parser = new PDFParse({ data: pdfBuffer });
      const pdfData = await parser.getText();
      await parser.destroy();

      assert.match(
        pdfData.text,
        new RegExp(expectedSurname),
        `Surname ${expectedSurname} not found in PDF text`
      );
    });
  });
});
