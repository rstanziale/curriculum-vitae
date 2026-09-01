import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { afterEach, describe, it, mock } from 'node:test';

import { extractLangFromPath, loadCvData } from '../../src/data/loader.ts';

describe('data/loader.ts', () => {
  const validCvJson = JSON.stringify({
    personalInfo: {
      firstName: 'Roberto',
      surname: 'Stanziale',
      subtitle: 'Software Engineer',
      phone: 'ENV_PHONE',
      email: 'ENV_EMAIL',
    },
    labels: {
      aboutMe: 'About Me',
      languages: 'Languages',
      skills: 'Skills',
      softSkills: 'Soft Skills',
      hobbies: 'Hobbies',
    },
    aboutMe: 'Test about me',
    languages: [{ name: 'Italian', level: 'Native' }],
    hardSkills: ['TypeScript', 'Node.js'],
    softSkills: ['Communication', 'Teamwork'],
    hobbies: ['Reading', 'Gaming'],
  });

  afterEach(() => {
    mock.restoreAll();
  });

  describe('loadCvData', () => {
    it('loads and parses CV data with env replacement', async () => {
      mock.method(fs, 'readFile', async () => validCvJson);
      const env = { PERSONAL_PHONE: '+39 300 123 4567', PERSONAL_EMAIL: 'test@example.com' };

      const data = await loadCvData('cv.ita.json', env);

      assert.strictEqual(data.personalInfo.phone, '+39 300 123 4567');
      assert.strictEqual(data.personalInfo.email, 'test@example.com');
      assert.strictEqual(data.personalInfo.firstName, 'Roberto');
    });

    it('uses default values when env vars not set', async () => {
      mock.method(fs, 'readFile', async () => validCvJson);
      const env: NodeJS.ProcessEnv = {};

      const data = await loadCvData('cv.ita.json', env);

      assert.strictEqual(data.personalInfo.phone, '+39 000 000 0000');
      assert.strictEqual(data.personalInfo.email, 'email@example.com');
    });

    it('throws on invalid JSON', async () => {
      mock.method(fs, 'readFile', async () => 'invalid json');
      const env: NodeJS.ProcessEnv = {};

      await assert.rejects(loadCvData('cv.ita.json', env), /JSON/);
    });
  });

  describe('extractLangFromPath', () => {
    it('extracts ITA from cv.ita.json', () => {
      const lang = extractLangFromPath('data/cv.ita.json');
      assert.strictEqual(lang, 'ITA');
    });

    it('extracts ENG from cv.eng.json', () => {
      const lang = extractLangFromPath('data/cv.eng.json');
      assert.strictEqual(lang, 'ENG');
    });

    it('extracts ITA from cv.ITA.json (case insensitive)', () => {
      const lang = extractLangFromPath('data/cv.ITA.json');
      assert.strictEqual(lang, 'ITA');
    });

    it('extracts FRA from cv.fra.json (generic language)', () => {
      const lang = extractLangFromPath('data/cv.fra.json');
      assert.strictEqual(lang, 'FRA');
    });

    it('works with Windows paths', () => {
      const lang = extractLangFromPath('data\\cv.eng.json');
      assert.strictEqual(lang, 'ENG');
    });

    it('throws on invalid filename format', () => {
      assert.throws(() => extractLangFromPath('data/cv.json'), /Invalid CV data filename/);
      assert.throws(() => extractLangFromPath('data/cv.schema.json'), /Invalid CV data filename/);
      assert.throws(() => extractLangFromPath('data/cv.toolong.json'), /Invalid CV data filename/);
    });
  });
});
