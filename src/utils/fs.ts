import fs from 'node:fs/promises';

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
 * Reads a file as Buffer (binary)
 * @param filePath - Path to the file
 * @returns File content as Buffer
 * @throws If file cannot be read
 */
export async function readFileBuffer(filePath: string): Promise<Buffer> {
  return fs.readFile(filePath);
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
 * Reads directory entries
 * @param dirPath - Directory path
 * @returns List of file and directory names
 * @throws If directory cannot be read
 */
export async function readdir(dirPath: string): Promise<string[]> {
  return fs.readdir(dirPath);
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

//#endregion
