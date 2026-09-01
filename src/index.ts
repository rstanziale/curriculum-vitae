import fs from 'node:fs/promises';
import path from 'node:path';

import type { TemplateDelegate } from 'handlebars';

import { CV_TEMPLATE_NAME, resolvePaths } from './config/paths.ts';
import { getCvTag } from './config/tag.ts';
import { extractLangFromPath, loadCvData } from './data/loader.ts';
import { validateCvData } from './data/validator.ts';
import { generatePdf } from './pdf/generator.ts';
import { getPdfOptions } from './pdf/options.ts';
import { createTemplateRegistry, getTemplate } from './template/registry.ts';
import { formatDuration } from './utils/timing.ts';

//#region public methods

/**
 * Main build function - orchestrates entire pipeline for all languages
 */
export async function build(): Promise<void> {
  const overallStart = performance.now();
  const paths = resolvePaths();
  const tag = getCvTag();
  const schema = JSON.parse(await fs.readFile(paths.schemaPath, 'utf8')) as object;

  await fs.mkdir(paths.distDir, { recursive: true });

  const templateRegistry = await createTemplateRegistry(paths.templatesDir);
  const template = getTemplate(templateRegistry, CV_TEMPLATE_NAME);

  const dataFiles = await discoverCvDataFiles(paths.dataDir, paths.schemaPath);

  for (const dataFile of dataFiles) {
    await buildForLanguage(dataFile, paths, schema, template, tag);
  }

  const totalDuration = performance.now() - overallStart;
  console.log(
    `✨ Build completed in ${formatDuration(totalDuration)} — ${dataFiles.length} file(s) generated`
  );
}

//#endregion

//#region private methods

/**
 * Discovers CV data files in data directory, excluding schema file
 * @param dataDir - Data directory path
 * @param schemaPath - Schema file path to exclude
 * @returns Filtered list of cv.*.json files
 */
export async function discoverCvDataFiles(dataDir: string, schemaPath: string): Promise<string[]> {
  const files = await fs.readdir(dataDir);
  const schemaBase = path.basename(schemaPath);
  const cvPattern = /^cv\.[a-z]{2,3}\.json$/i;
  return files.filter(file => file !== schemaBase && cvPattern.test(file));
}

/**
 * Builds PDF for a single language version
 * @param dataFile - CV data filename (e.g. cv.ita.json)
 * @param paths - Resolved project paths
 * @param schema - JSON schema object for validation
 * @param template - Compiled Handlebars template delegate
 * @param tag - Version tag for output filename
 * @throws If data loading, validation, or PDF generation fails
 */
async function buildForLanguage(
  dataFile: string,
  paths: ReturnType<typeof resolvePaths>,
  schema: object,
  template: TemplateDelegate,
  tag: string
): Promise<void> {
  const start = performance.now();
  const dataPath = path.join(paths.dataDir, dataFile);
  const lang = extractLangFromPath(dataPath);
  const outputFileName = `CV_RBS_${lang}-${tag}.pdf`;
  const outputPath = path.join(paths.distDir, outputFileName);

  console.log(`📄 Building ${lang} version...`);

  const data = await loadCvData(dataPath, process.env);
  validateCvData(data, schema);

  const html = template(data);
  const options = getPdfOptions();

  await generatePdf(html, outputPath, options);
  const duration = performance.now() - start;
  console.log(`✅ Generated: ${outputPath} in ${formatDuration(duration)}`);
}

//#endregion

// CLI execution
await build().catch(err => {
  console.error('❌ Error generating PDF:', err);
  process.exit(1);
});
