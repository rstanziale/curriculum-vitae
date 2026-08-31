import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';

import { resolvePaths } from '../../src/config/paths.ts';

describe('config/paths.ts', () => {
  describe('resolvePaths', () => {
    it('returns all expected path properties', () => {
      const paths = resolvePaths();

      assert.ok(paths.projectRoot);
      assert.ok(paths.dataDir);
      assert.ok(paths.templatesDir);
      assert.ok(paths.distDir);
      assert.ok(paths.schemaPath);
      assert.ok(paths.cvTemplatePath);
    });

    it('returns absolute paths', () => {
      const paths = resolvePaths();

      assert.strictEqual(path.isAbsolute(paths.projectRoot), true);
      assert.strictEqual(path.isAbsolute(paths.dataDir), true);
      assert.strictEqual(path.isAbsolute(paths.templatesDir), true);
      assert.strictEqual(path.isAbsolute(paths.distDir), true);
      assert.strictEqual(path.isAbsolute(paths.schemaPath), true);
      assert.strictEqual(path.isAbsolute(paths.cvTemplatePath), true);
    });

    it('resolves data directory correctly', () => {
      const paths = resolvePaths();
      const expected = path.join(paths.projectRoot, 'data');
      assert.strictEqual(paths.dataDir, expected);
    });

    it('resolves templates directory correctly', () => {
      const paths = resolvePaths();
      const expected = path.join(paths.projectRoot, 'templates');
      assert.strictEqual(paths.templatesDir, expected);
    });

    it('resolves dist directory correctly', () => {
      const paths = resolvePaths();
      const expected = path.join(paths.projectRoot, 'dist');
      assert.strictEqual(paths.distDir, expected);
    });

    it('resolves schema path correctly', () => {
      const paths = resolvePaths();
      const expected = path.join(paths.projectRoot, 'data', 'cv.schema.json');
      assert.strictEqual(paths.schemaPath, expected);
    });

    it('resolves cv template path correctly', () => {
      const paths = resolvePaths();
      const expected = path.join(paths.projectRoot, 'templates', 'cv.html');
      assert.strictEqual(paths.cvTemplatePath, expected);
    });
  });
});
