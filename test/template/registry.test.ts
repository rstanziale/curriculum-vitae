import assert from 'node:assert/strict';
import * as path from 'node:path';
import { describe, it } from 'node:test';

import handlebars from 'handlebars';

import { createTemplateRegistry, getTemplate } from '../../src/template/registry.ts';

describe('template/registry.ts', () => {
  describe('createTemplateRegistry', () => {
    it('loads and compiles all .html templates', async () => {
      const mockTemplates = {
        'cv.html': '<h1>{{title}}</h1>',
        'custom.html': '<div>{{content}}</div>',
      };

      const readFile = async (filePath: string) => {
        const fileName = path.basename(filePath);
        return mockTemplates[fileName as keyof typeof mockTemplates] ?? '';
      };
      const readdir = async () => Object.keys(mockTemplates);

      const registry = await createTemplateRegistry('/templates', readFile, readdir);

      assert.strictEqual(registry.templates.size, 2);
      assert.ok(registry.templates.has('cv'));
      assert.ok(registry.templates.has('custom'));

      const cvHtml = registry.templates.get('cv')?.({ title: 'Test' });
      assert.strictEqual(cvHtml, '<h1>Test</h1>');
    });

    it('ignores non-html files', async () => {
      const readFile = async () => '<h1>{{title}}</h1>';
      const readdir = async () => ['cv.html', 'readme.txt', 'style.css'];

      const registry = await createTemplateRegistry('/templates', readFile, readdir);

      assert.strictEqual(registry.templates.size, 1);
      assert.ok(registry.templates.has('cv'));
    });
  });

  describe('getTemplate', () => {
    it('returns template by name', () => {
      const template = handlebars.compile('<h1>{{title}}</h1>');
      const registry = { templates: new Map([['cv', template]]), templateDir: '/templates' };

      const result = getTemplate(registry, 'cv');
      assert.strictEqual(result({ title: 'Test' }), '<h1>Test</h1>');
    });

    it('throws if template not found', () => {
      const registry = { templates: new Map(), templateDir: '/templates' };
      assert.throws(() => getTemplate(registry, 'missing'), /Template not found/);
    });
  });
});
