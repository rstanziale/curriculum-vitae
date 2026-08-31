import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { compileTemplate } from '../../src/template/compiler.ts';

describe('template/compiler.ts', () => {
  const templateSource = '<h1>{{title}}</h1><p>{{content}}</p>';
  const data = { title: 'Test Title', content: 'Test content' };

  describe('compileTemplate', () => {
    it('renders template with data', () => {
      const html = compileTemplate(templateSource, data);
      assert.ok(html.includes('<h1>Test Title</h1>'));
      assert.ok(html.includes('<p>Test content</p>'));
    });

    it('handles missing data gracefully', () => {
      const html = compileTemplate(templateSource, {});
      assert.ok(html.includes('<h1></h1>'));
      assert.ok(html.includes('<p></p>'));
    });

    it('throws on invalid template syntax', () => {
      const invalidTemplate = '{{#if missing}}';
      assert.throws(() => compileTemplate(invalidTemplate, data), /Parse error/);
    });
  });
});
