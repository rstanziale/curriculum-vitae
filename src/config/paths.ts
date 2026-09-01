import { joinPath, resolvePath } from '../utils/path.ts';

export const CV_TEMPLATE_NAME = 'cv' as const;

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
    dataDir: joinPath(projectRoot, 'data'),
    templatesDir: joinPath(projectRoot, 'templates'),
    distDir: joinPath(projectRoot, 'dist'),
    schemaPath: joinPath(projectRoot, 'data', 'cv.schema.json'),
    cvTemplatePath: joinPath(projectRoot, 'templates', 'cv.html'),
  };
}

//#endregion

//#region private methods

/**
 * Gets the project root directory
 * @returns Absolute path to project root
 */
function getProjectRoot(): string {
  return resolvePath('.');
}

//#endregion
