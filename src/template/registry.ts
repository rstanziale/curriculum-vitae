import handlebars from 'handlebars';

import { readdir, readFile } from '../utils/fs.ts';
import { basename, joinPath } from '../utils/path.ts';

export interface TemplateRegistry {
  templates: Map<string, handlebars.TemplateDelegate>;
}

//#region public methods

/**
 * Creates a template registry by loading all .html files from the template directory
 * @param templateDir - Directory containing template files
 * @returns Template registry with compiled templates
 */
export async function createTemplateRegistry(templateDir: string): Promise<TemplateRegistry> {
  const templates = new Map<string, handlebars.TemplateDelegate>();
  const files = await readdir(templateDir);

  for (const file of files) {
    if (file.endsWith('.html')) {
      const name = basename(file, '.html');
      const source = await readFile(joinPath(templateDir, file));
      templates.set(name, handlebars.compile(source));
    }
  }

  return { templates };
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
