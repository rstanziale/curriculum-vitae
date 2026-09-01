import fs from 'node:fs/promises';
import path from 'node:path';

//#region public methods

/**
 * Reads a file as UTF-8 string
 * @param filePath - Path to the file
 * @returns File content as string
 * @throws If file cannot be read
 */
export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf8');
}

/**
 * Ensures a directory exists, creating it recursively if needed
 * @param dir - Directory path
 * @throws If directory cannot be created
 */
export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

/**
 * Checks if a path exists
 * @param filePath - Path to check
 * @returns True if path exists
 */
export async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolves a path relative to the project root
 * @param relativePath - Path relative to project root
 * @returns Absolute path
 */
export function resolvePath(relativePath: string): string {
  return path.resolve(relativePath);
}

//#endregion
