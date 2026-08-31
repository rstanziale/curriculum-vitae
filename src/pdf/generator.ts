import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { type Browser, chromium, type Page } from 'playwright';

import { resolvePaths } from '../config/paths.ts';
import type { PdfOptions } from './options.ts';
import { checkPageHeight } from './viewport.ts';

export interface BrowserFactory {
  launch: () => Promise<Browser>;
}

//#region public methods

/**
 * Generates PDF from HTML using Playwright
 * @param html - HTML content to render
 * @param outputPath - Output file path
 * @param options - PDF generation options
 * @param browserFactory - Optional custom browser factory for testing
 * @throws If PDF generation fails
 */
export async function generatePdf(
  html: string,
  outputPath: string,
  options: PdfOptions,
  browserFactory?: BrowserFactory
): Promise<void> {
  const browser = await createBrowser(browserFactory);
  const page = await createPage(browser);

  try {
    await waitForContent(page, html);
    await checkPageHeight(page, 1123);
    await page.pdf({ path: outputPath, ...options });
  } finally {
    await browser.close();
  }
}

//#endregion

//#region private methods

/**
 * Creates browser instance
 * @param browserFactory - Optional custom browser factory
 * @returns Browser instance
 */
async function createBrowser(browserFactory?: BrowserFactory): Promise<Browser> {
  if (browserFactory) {
    return browserFactory.launch();
  }
  return chromium.launch();
}

/**
 * Creates new page and sets viewport
 * @param browser - Browser instance
 * @returns Page instance
 */
async function createPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 794, height: 1123 });
  return page;
}

/**
 * Sets page content and waits for all external resources, including fonts, to load
 * @param page - Page instance
 * @param html - HTML content to render
 */
async function waitForContent(page: Page, html: string): Promise<void> {
  const htmlWithBaseHref = ensureBaseHref(html);
  const htmlWithEmbeddedFonts = await embedFontsAsDataUri(htmlWithBaseHref);
  await page.setContent(htmlWithEmbeddedFonts, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

/**
 * Ensures the document has a valid base URL so relative asset paths resolve correctly
 * @param html - HTML content to update
 * @returns HTML with a base tag when needed
 */
function ensureBaseHref(html: string): string {
  if (/<base\s+/i.test(html)) {
    return html;
  }

  const templatesDir = resolvePaths().templatesDir;
  const baseHref = `${pathToFileURL(path.join(templatesDir)).href}/`;
  const baseTag = `<base href="${baseHref}">`;

  if (/<head\s*>/i.test(html)) {
    return html.replace(/<head\s*>/i, `<head>${baseTag}`);
  }

  if (/<body\s*>/i.test(html)) {
    return html.replace(/<body\s*>/i, `<head>${baseTag}</head>$&`);
  }

  return `${baseTag}${html}`;
}

/**
 * Replaces any local font references with data URLs so the generated PDF is self-contained
 * @param html - HTML content that may reference local font files
 * @returns HTML where all .ttf files are embedded as data URIs
 */
async function embedFontsAsDataUri(html: string): Promise<string> {
  const fontDir = path.join(resolvePaths().projectRoot, 'assets', 'fonts');
  const fontFiles = await fs.promises.readdir(fontDir);
  const ttfFiles = fontFiles.filter(file => file.toLowerCase().endsWith('.ttf'));

  let result = html;

  for (const fileName of ttfFiles) {
    const filePath = path.join(fontDir, fileName);
    const buffer = await fs.promises.readFile(filePath);
    const dataUri = `data:font/truetype;base64,${buffer.toString('base64')}`;

    result = result.replace(
      new RegExp(String.raw`url\(['"]?\.?\.?/assets/fonts/${fileName}['"]?\)`, 'gi'),
      `url('${dataUri}')`
    );
  }

  return result;
}

//#endregion
