import path from 'node:path';

export interface Paths {
  projectRoot: string;
  dataDir: string;
  templatesDir: string;
  distDir: string;
  schemaPath: string;
  cvTemplatePath: string;
}

//#region public methods

/**
 * Resolves all absolute paths used by the build process
 * @returns Object containing all resolved paths
 */
export function resolvePaths(): Paths {
  const projectRoot = getProjectRoot();
  return {
    projectRoot,
    dataDir: path.join(projectRoot, 'data'),
    templatesDir: path.join(projectRoot, 'templates'),
    distDir: path.join(projectRoot, 'dist'),
    schemaPath: path.join(projectRoot, 'data', 'cv.schema.json'),
    cvTemplatePath: path.join(projectRoot, 'templates', 'cv.html'),
  };
}

//#endregion

//#region private methods

/**
 * Gets the project root directory
 * @returns Absolute path to project root
 */
function getProjectRoot(): string {
  return path.resolve('.');
}

//#endregion
