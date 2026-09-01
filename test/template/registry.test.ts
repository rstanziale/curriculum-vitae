import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as path from 'node:path';
import { afterEach, describe, it, mock } from 'node:test';

import handlebars from 'handlebars';

import { createTemplateRegistry, getTemplate } from '../../src/template/registry.ts';

describe('template/registry.ts', () => {
  afterEach(() => {
    mock.restoreAll();
  });

  describe('createTemplateRegistry', () => {
    it('loads and compiles all .html templates', async () => {
      const mockTemplates = {
        'cv.html': '<h1>{{title}}</h1>',
        'custom.html': '<div>{{content}}</div>',
      };

      mock.method(fs, 'readdir', async () => Object.keys(mockTemplates));
      mock.method(fs, 'readFile', async (filePath: string) => {
        const fileName = path.basename(filePath as string);
        return mockTemplates[fileName as keyof typeof mockTemplates] ?? '';
      });

      const registry = await createTemplateRegistry('/templates');

      assert.strictEqual(registry.templates.size, 2);
      assert.ok(registry.templates.has('cv'));
      assert.ok(registry.templates.has('custom'));

      const cvHtml = registry.templates.get('cv')?.({ title: 'Test' });
      assert.strictEqual(cvHtml, '<h1>Test</h1>');
    });

    it('ignores non-html files', async () => {
      mock.method(fs, 'readdir', async () => ['cv.html', 'readme.txt', 'style.css']);
      mock.method(fs, 'readFile', async () => '<h1>{{title}}</h1>');

      const registry = await createTemplateRegistry('/templates');

      assert.strictEqual(registry.templates.size, 1);
      assert.ok(registry.templates.has('cv'));
    });
  });

  describe('getTemplate', () => {
    it('returns template by name', () => {
      const template = handlebars.compile('<h1>{{title}}</h1>');
      const registry = { templates: new Map([['cv', template]]) };

      const result = getTemplate(registry, 'cv');
      assert.strictEqual(result({ title: 'Test' }), '<h1>Test</h1>');
    });

    it('throws if template not found', () => {
      const registry = { templates: new Map() };
      assert.throws(() => getTemplate(registry, 'missing'), /Template not found/);
    });
  });
});
