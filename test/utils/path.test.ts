import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';

import { basename, joinPath, resolvePath } from '../../src/utils/path.ts';

describe('utils/path.ts', () => {
  describe('joinPath', () => {
    it('joins path segments', () => {
      const result = joinPath('a', 'b', 'c');
      assert.strictEqual(result, path.join('a', 'b', 'c'));
    });

    it('joins single segment', () => {
      const result = joinPath('a');
      assert.strictEqual(result, path.join('a'));
    });

    it('handles empty segments', () => {
      const result = joinPath('a', '', 'c');
      assert.strictEqual(result, path.join('a', '', 'c'));
    });
  });

  describe('basename', () => {
    it('gets basename without extension', () => {
      const result = basename('/a/b/c.txt');
      assert.strictEqual(result, path.basename('/a/b/c.txt'));
    });

    it('gets basename with extension removal', () => {
      const result = basename('/a/b/c.txt', '.txt');
      assert.strictEqual(result, path.basename('/a/b/c.txt', '.txt'));
    });

    it('handles file.html with .html ext', () => {
      const result = basename('file.html', '.html');
      assert.strictEqual(result, 'file');
    });
  });

  describe('resolvePath', () => {
    it('resolves relative path', () => {
      const resolved = resolvePath('data/file.json');
      assert.ok(resolved.includes('data'));
      assert.ok(resolved.includes('file.json'));
      assert.ok(resolved.startsWith('/') || resolved.match(/^[A-Za-z]:/));
    });

    it('resolves multiple segments', () => {
      const resolved = resolvePath('a', 'b', 'c');
      assert.strictEqual(resolved, path.resolve('a', 'b', 'c'));
    });

    it('resolves current directory', () => {
      const resolved = resolvePath('.');
      assert.strictEqual(resolved, path.resolve('.'));
    });
  });
});
