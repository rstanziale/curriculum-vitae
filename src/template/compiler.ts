import handlebars from 'handlebars';

//#region public methods

/**
 * Compiles Handlebars template and renders with data
 * @param templateSource - Handlebars template source string
 * @param data - Data to render (any object)
 * @returns Rendered HTML string
 * @throws If template compilation or rendering fails
 */
export function compileTemplate(templateSource: string, data: Record<string, unknown>): string {
  const template = createTemplate(templateSource);
  return template(data);
}

//#endregion

//#region private methods

/**
 * Creates Handlebars template function
 * @param source - Template source string
 * @returns Compiled Handlebars template function
 */
function createTemplate(source: string): handlebars.TemplateDelegate {
  return handlebars.compile(source);
}

//#endregion
