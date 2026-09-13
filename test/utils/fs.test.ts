import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { afterEach, describe, it, mock } from 'node:test';

import { ensureDir, exists, readdir, readFile, readFileBuffer } from '../../src/utils/fs.ts';

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

  describe('readFileBuffer', () => {
    it('reads file as buffer', async () => {
      const expected = Buffer.from('binary content');
      mock.method(fs, 'readFile', async () => expected);
      const content = await readFileBuffer('font.ttf');
      assert.ok(content instanceof Buffer);
      assert.strictEqual(content.toString(), 'binary content');
    });

    it('throws on binary read error', async () => {
      mock.method(fs, 'readFile', async () => {
        throw new Error('ENOENT');
      });
      await assert.rejects(readFileBuffer('font.ttf'), /ENOENT/);
    });
  });

  describe('readdir', () => {
    it('reads directory entries', async () => {
      mock.method(
        fs,
        'readdir',
        async () => ['a.txt', 'b.txt'] as unknown as Awaited<ReturnType<typeof fs.readdir>>
      );
      const entries = await readdir('some/dir');
      assert.deepStrictEqual(entries, ['a.txt', 'b.txt']);
    });

    it('throws on readdir error', async () => {
      mock.method(fs, 'readdir', async () => {
        throw new Error('ENOENT');
      });
      await assert.rejects(readdir('some/dir'), /ENOENT/);
    });
  });
});
