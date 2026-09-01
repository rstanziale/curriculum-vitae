import fs from 'node:fs/promises';
import path from 'node:path';

import handlebars from 'handlebars';

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
  const files = await fs.readdir(templateDir);

  for (const file of files) {
    if (file.endsWith('.html')) {
      const name = path.basename(file, '.html');
      const source = await fs.readFile(path.join(templateDir, file), 'utf8');
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
