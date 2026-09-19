import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { tool } from '@opencode-ai/plugin';

import type { CvData } from '../../src/data/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

/**
 * Tool to update the "About me" section of the CV.
 */
export const aboutMe = tool({
  description: 'Update the "About me" section of the CV',
  args: {
    lang: tool.schema.string().describe('The language of the content to update'),
    content: tool.schema.string().describe('The updated content for the "About me" section'),
  },
  async execute(args) {
    const { lang, content } = args;

    try {
      const dataPath = path.join(PROJECT_ROOT, 'data', `cv.${lang}.json`);

      let dataContent = '';
      if (fs.existsSync(dataPath)) {
        dataContent = fs.readFileSync(dataPath, 'utf-8');
        const dataJson: CvData = JSON.parse(dataContent);

        dataJson.aboutMe = content;
        fs.writeFileSync(dataPath, JSON.stringify(dataJson, null, 2), 'utf-8');
      }
      return `Success: Updated "About me" section in ${dataPath}`;
    } catch (error) {
      return `Error during "About me" section update: ${(error as Error).message}`;
    }
  },
});

/**
 * Tool to update the "Work Experience" section of the CV.
 */
export const workExperience = tool({
  description: 'Update the "Work Experience" section of the CV',
  args: {
    lang: tool.schema.string().describe('The language of the content to update'),
    workExperience: tool.schema
      .array(
        tool.schema.object({
          company: tool.schema.string().describe('The name of the company'),
          period: tool.schema.string().describe('The period of employment'),
          role: tool.schema.string().describe('The role or position held'),
          techStack: tool.schema.array(tool.schema.string()).describe('The technology stack used'),
          highlights: tool.schema
            .array(
              tool.schema.object({
                title: tool.schema.string().describe('The title of the highlight'),
                description: tool.schema.string().describe('The description of the highlight'),
              })
            )
            .describe('The highlights of the work experience'),
        })
      )
      .describe('The updated work experience content for the "About me" section'),
  },
  async execute(args) {
    const { lang, workExperience } = args;

    try {
      const dataPath = path.join(PROJECT_ROOT, 'data', `cv.${lang}.json`);

      let dataContent = '';
      if (fs.existsSync(dataPath)) {
        dataContent = fs.readFileSync(dataPath, 'utf-8');
        const dataJson: CvData = JSON.parse(dataContent);

        dataJson.workExperience = workExperience;
        fs.writeFileSync(dataPath, JSON.stringify(dataJson, null, 2), 'utf-8');
      }
      return `Success: Updated "Work Experience" section in ${dataPath}`;
    } catch (error) {
      return `Error during "Work Experience" section update: ${(error as Error).message}`;
    }
  },
});

/**
 * Tool to update the "CV_TAG" environment variable in the .env file.
 */
export const cvTag = tool({
  description: 'Update the "CV_TAG" environment variable',
  args: {
    tagValue: tool.schema
      .string()
      .default('personal')
      .describe('The Company name or `personal` to set CV_TAG environment variable'),
  },
  async execute(args) {
    try {
      const { tagValue } = args;
      const tag = formatTag(tagValue);

      const envPath = path.join(PROJECT_ROOT, '.env');

      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
      }

      const key = 'CV_TAG';
      const regex = new RegExp(`^${key}=.*$`, 'm');

      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}="${tag}"`);
      } else {
        // Add the variable if it doesn't exist
        const prefix = envContent.length > 0 && !envContent.endsWith('\n') ? '\n' : '';
        envContent += `${prefix}${key}="${tag}"\n`;
      }

      fs.writeFileSync(envPath, envContent, 'utf-8');

      return `Success: CV_TAG="${tag}"`;
    } catch (error) {
      return `Error during .env file update: ${(error as Error).message}`;
    }
  },
});

/**
 * Derives a tag from a company name.
 * @param name The company name
 * @returns The derived tag
 */
const formatTag = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};
