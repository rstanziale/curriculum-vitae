export const DEFAULT_TAG = 'test';

/**
 * Returns CV tag from environment
 * @param env - Environment variables (defaults to process.env)
 * @returns Tag string or "test" if absent/empty
 */
export function getCvTag(env: NodeJS.ProcessEnv = process.env): string {
  const raw = env.CV_TAG?.trim();
  return raw ? raw : DEFAULT_TAG;
}
