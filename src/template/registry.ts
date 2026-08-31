import fs from 'node:fs/promises';
import path from 'node:path';

import handlebars from 'handlebars';

export interface TemplateRegistry {
  templates: Map<string, handlebars.TemplateDelegate>;
  templateDir: string;
}

type FileReader = (path: string, encoding?: string) => Promise<string>;
type DirReader = (dir: string) => Promise<string[]>;

//#region public methods

/**
 * Creates a template registry by loading all .html files from the template directory
 * @param templateDir - Directory containing template files
 * @param readFile - Optional custom file reader for testing
 * @param readdir - Optional custom directory reader for testing
 * @returns Template registry with compiled templates
 */
export async function createTemplateRegistry(
  templateDir: string,
  readFile?: FileReader,
  readdir?: DirReader
): Promise<TemplateRegistry> {
  const templates = new Map<string, handlebars.TemplateDelegate>();
  const reader = readdir ?? fs.readdir;
  const fileReader = readFile ?? fs.readFile;
  const files = await reader(templateDir);

  for (const file of files) {
    if (file.endsWith('.html')) {
      const name = path.basename(file, '.html');
      const source = await fileReader(path.join(templateDir, file), 'utf8');
      templates.set(name, handlebars.compile(source));
    }
  }

  return { templates, templateDir };
}

/**
 * Gets compiled template by name
 * @param registry - Template registry
 * @param name - Template name (without .html extension)
 * @returns Compiled Handlebars template function
 * @throws If template not found
 */
export function getTemplate(registry: TemplateRegistry, name: string): handlebars.TemplateDelegate {
  const template = registry.templates.get(name);
  if (!template) {
    throw new Error(`Template not found: ${name}`);
  }
  return template;
}

//#endregion
