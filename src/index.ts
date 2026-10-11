import { resolvePaths } from './config/paths.ts';
import { getCvTag } from './config/tag.ts';
import { extractLangFromPath, loadCvData } from './data/loader.ts';
import { validateCvData } from './data/validator.ts';
import { generatePdf } from './pdf/generator.ts';
import { getPdfOptions } from './pdf/options.ts';
import {
  createTemplateRegistry,
  getTemplate,
  TEMPLATE_NAME,
  type TemplateRegistry,
} from './template/registry.ts';
import { ensureDir, readdir, readFile } from './utils/fs.ts';
import { basename, joinPath } from './utils/path.ts';
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
  console.log(
    `📦 Loaded ${templateRegistry.templates.size} template(s) from ${paths.templatesDir}`
  );

  const dataFiles = await discoverCvDataFiles(paths.dataDir, paths.schemaPath);

  for (const dataFile of dataFiles) {
    await buildForLanguage(dataFile, paths, schema, templateRegistry, tag);
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
  const files = await readdir(dataDir);
  const schemaBase = basename(schemaPath);
  const cvPattern = /^cv\.[a-z]{2,3}\.json$/i;
  return files.filter(file => file !== schemaBase && cvPattern.test(file));
}

/**
 * Builds PDF for a single language version
 * @param dataFile - CV data filename (e.g. cv.ita.json)
 * @param paths - Resolved project paths
 * @param schema - JSON schema object for validation
 * @param registry - Handlebars template registry
 * @param tag - Version tag for output filename
 * @throws If data loading, validation, or PDF generation fails
 */
async function buildForLanguage(
  dataFile: string,
  paths: ReturnType<typeof resolvePaths>,
  schema: object,
  registry: TemplateRegistry,
  tag: string
): Promise<void> {
  const start = performance.now();
  const dataPath = joinPath(paths.dataDir, dataFile);
  const lang = extractLangFromPath(dataPath);
  const outputFileName = `CV_RBS_${lang}-${tag}.pdf`;
  const outputPath = joinPath(paths.distDir, outputFileName);

  console.log(`📄 Building ${lang} version...`);

  const data = await loadCvData(dataPath, process.env);
  validateCvData(data, schema);

  const cvTemplate = getTemplate(registry, TEMPLATE_NAME.CV);
  const footerTemplate = getTemplate(registry, TEMPLATE_NAME.FOOTER);

  const cv = cvTemplate(data);
  const footer = footerTemplate({ text: data.gdprConsent || '' });
  const options = getPdfOptions({ withFooter: !!data.gdprConsent, footerTemplate: footer });

  await generatePdf(cv, outputPath, options);

  const duration = performance.now() - start;
  console.log(`✅ Generated: ${outputPath} in ${formatDuration(duration)}`);
}

//#endregion

// CLI execution
await build().catch(err => {
  console.error('❌ Error generating PDF:', err);
  process.exit(1);
});
