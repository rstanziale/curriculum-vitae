import path from 'node:path';

import type { TemplateDelegate } from 'handlebars';

import { resolvePaths } from './config/paths.ts';
import { getCvTag } from './config/tag.ts';
import { extractLangFromPath, loadCvData } from './data/loader.ts';
import { validateCvData } from './data/validator.ts';
import { generatePdf } from './pdf/generator.ts';
import { getPdfOptions } from './pdf/options.ts';
import { createTemplateRegistry, getTemplate } from './template/registry.ts';
import { ensureDir, readFile } from './utils/fs.ts';
import { formatDuration } from './utils/timing.ts';

//#region public methods

/**
 * Main build function - orchestrates entire pipeline for all languages
 */
export async function build(): Promise<void> {
  const overallStart = performance.now();
  const paths = resolvePaths();
  const tag = getCvTag();
  const schema = JSON.parse(await readFile(paths.schemaPath)) as object;

  await ensureDir(paths.distDir);

  const templateRegistry = await createTemplateRegistry(paths.templatesDir);
  const template = getTemplate(templateRegistry, 'cv');

  const dataFiles = ['cv.ita.json', 'cv.eng.json'];

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
