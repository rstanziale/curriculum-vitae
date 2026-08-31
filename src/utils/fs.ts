import fs from 'node:fs/promises';
import path from 'node:path';

type FileReader = (path: string, encoding?: string) => Promise<string>;
type DirMaker = (dir: string, options?: { recursive?: boolean }) => Promise<void>;

//#region public methods

/**
 * Reads a file as UTF-8 string
 * @param filePath - Path to the file
 * @param readFile - Optional custom file reader for testing
 * @returns File content as string
 * @throws If file cannot be read
 */
export async function readFile(filePath: string, readFile?: FileReader): Promise<string> {
  const reader = readFile ?? fs.readFile;
  return reader(filePath, 'utf8');
}

/**
 * Ensures a directory exists, creating it recursively if needed
 * @param dir - Directory path
 * @param mkdir - Optional custom directory maker for testing
 * @throws If directory cannot be created
 */
export async function ensureDir(dir: string, mkdir?: DirMaker): Promise<void> {
  const maker = mkdir ?? fs.mkdir;
  await maker(dir, { recursive: true });
}

/**
 * Checks if a path exists
 * @param filePath - Path to check
 * @param stat - Optional custom stat function for testing
 * @returns True if path exists
 */
export async function exists(
  filePath: string,
  stat?: (path: string) => Promise<Record<string, unknown>>
): Promise<boolean> {
  const checker = stat ?? fs.stat;
  try {
    await checker(filePath);
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
