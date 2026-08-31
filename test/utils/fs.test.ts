import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { resolvePath } from '../../src/utils/fs.ts';

describe('utils/fs.ts', () => {
  describe('readFile', () => {
    it('reads file content', async () => {
      const readFile = async () => 'file content';
      const { readFile: readFileFn } = await import('../../src/utils/fs.ts');
      const content = await readFileFn('test.txt', readFile);
      assert.strictEqual(content, 'file content');
    });

    it('throws on read error', async () => {
      const readFile = async () => {
        throw new Error('ENOENT');
      };
      const { readFile: readFileFn } = await import('../../src/utils/fs.ts');
      await assert.rejects(readFileFn('test.txt', readFile), /ENOENT/);
    });
  });

  describe('ensureDir', () => {
    it('creates directory', async () => {
      let created = '';
      const mkdir = async (dir: string) => {
        created = dir;
      };
      const { ensureDir: ensureDirFn } = await import('../../src/utils/fs.ts');
      await ensureDirFn('test/dir', mkdir);
      assert.strictEqual(created, 'test/dir');
    });
  });

  describe('exists', () => {
    it('returns true for existing path', async () => {
      const stat = async () => ({ isFile: () => true, isDirectory: () => false });
      const { exists: existsFn } = await import('../../src/utils/fs.ts');
      const result = await existsFn('test.txt', stat);
      assert.strictEqual(result, true);
    });

    it('returns false for non-existing path', async () => {
      const stat = async () => {
        throw new Error('ENOENT');
      };
      const { exists: existsFn } = await import('../../src/utils/fs.ts');
      const result = await existsFn('test.txt', stat);
      assert.strictEqual(result, false);
    });
  });

  describe('resolvePath', () => {
    it('resolves relative path', () => {
      const resolved = resolvePath('data/file.json');
      assert.ok(resolved.includes('data'));
      assert.ok(resolved.includes('file.json'));
      assert.ok(resolved.startsWith('/') || resolved.match(/^[A-Za-z]:/));
    });
  });
});
