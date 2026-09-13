import path from 'node:path';

//#region public methods

/**
 * Joins path segments
 * @param segments - Path segments to join
 * @returns Joined path
 */
export function joinPath(...segments: string[]): string {
  return path.join(...segments);
}

/**
 * Gets the last portion of a path
 * @param filePath - Path to extract basename from
 * @param ext - Optional extension to remove
 * @returns Basename of the path
 */
export function basename(filePath: string, ext?: string): string {
  return ext ? path.basename(filePath, ext) : path.basename(filePath);
}

/**
 * Resolves a sequence of paths to an absolute path
 * @param segments - Path segments to resolve
 * @returns Absolute path
 */
export function resolvePath(...segments: string[]): string {
  return path.resolve(...segments);
}

//#endregion
