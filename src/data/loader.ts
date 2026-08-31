import fs from 'node:fs/promises';

import type { CvData } from './types.ts';

type FileReader = (path: string) => Promise<string>;

//#region public methods

/**
 * Loads CV data from JSON file, replacing ENV_* placeholders
 * @param dataPath - Path to the CV data JSON file
 * @param env - Environment variables for placeholder replacement
 * @param readFile - Optional custom file reader for testing
 * @returns Parsed and validated CV data
 * @throws If file cannot be read or parsed
 */
export async function loadCvData(
  dataPath: string,
  env: NodeJS.ProcessEnv,
  readFile?: FileReader
): Promise<CvData> {
  const raw = await (readFile?.(dataPath) ?? fs.readFile(dataPath, 'utf8'));
  const filled = replaceEnvPlaceholders(raw, env);
  return parseCvData(filled);
}

/**
 * Extracts language code from data filename (cv.ita.json → 'ITA')
 * @param dataPath - Path to the CV data file
 * @returns Language code ('ITA' or 'ENG')
 * @throws If filename format is invalid
 */
export function extractLangFromPath(dataPath: string): 'ITA' | 'ENG' {
  const fileName = dataPath.replaceAll('\\', '/').split('/').pop() ?? '';
  const match = new RegExp(/^cv\.(ita|eng)\.json$/i).exec(fileName);
  if (!match) {
    throw new Error(
      `Invalid CV data filename format: ${fileName}. Expected cv.ita.json or cv.eng.json`
    );
  }
  return match[1].toUpperCase() as 'ITA' | 'ENG';
}

//#endregion

//#region private methods

/**
 * Replaces ENV_PHONE, ENV_EMAIL placeholders in raw JSON string
 * @param raw - Raw JSON string with placeholders
 * @param env - Environment variables
 * @returns JSON string with placeholders replaced
 */
function replaceEnvPlaceholders(raw: string, env: NodeJS.ProcessEnv): string {
  return raw
    .replace('ENV_PHONE', env.PERSONAL_PHONE ?? '+39 000 000 0000')
    .replace('ENV_EMAIL', env.PERSONAL_EMAIL ?? 'email@example.com');
}

/**
 * Parses JSON string to typed CvData
 * @param json - JSON string
 * @returns Parsed CvData object
 * @throws If JSON is invalid
 */
function parseCvData(json: string): CvData {
  return JSON.parse(json) as CvData;
}

//#endregion
