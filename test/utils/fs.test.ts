import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { afterEach, describe, it, mock } from 'node:test';

import { ensureDir, exists, readFile, resolvePath } from '../../src/utils/fs.ts';

describe('utils/fs.ts', () => {
  afterEach(() => {
    mock.restoreAll();
  });

  describe('readFile', () => {
    it('reads file content', async () => {
      mock.method(fs, 'readFile', async () => 'file content');
      const content = await readFile('test.txt');
      assert.strictEqual(content, 'file content');
    });

    it('throws on read error', async () => {
      mock.method(fs, 'readFile', async () => {
        throw new Error('ENOENT');
      });
      await assert.rejects(readFile('test.txt'), /ENOENT/);
    });
  });

  describe('ensureDir', () => {
    it('creates directory', async () => {
      let created = '';
      mock.method(fs, 'mkdir', async (dir: string) => {
        created = dir;
      });
      await ensureDir('test/dir');
      assert.strictEqual(created, 'test/dir');
    });
  });

  describe('exists', () => {
    it('returns true for existing path', async () => {
      mock.method(
        fs,
        'stat',
        async () => ({ isFile: () => true }) as unknown as Awaited<ReturnType<typeof fs.stat>>
      );
      const result = await exists('test.txt');
      assert.strictEqual(result, true);
    });

    it('returns false for non-existing path', async () => {
      mock.method(fs, 'stat', async () => {
        throw new Error('ENOENT');
      });
      const result = await exists('test.txt');
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
