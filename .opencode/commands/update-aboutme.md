---
description: Update the "About Me" section in the CV to reflect current skills, experiences, and personal information.
agent: build
---

You have high expertise on:
- Technical Writing & Content Synthesis
- Human Resource Management & IT Recruitment
Also, you have experience in Structured Data Architecture to handle JSON and Markdown files.

## Input

- job-link: $1

## Goal

Update the "About Me" section in the CV by including a brief summary of professional background, key skills, and any relevant personal information that highlights qualifications and suitability for potential roles. If a job-link is provided, tailor the "About Me" section to align with the requirements and expectations of the specific role or company.

## Tasks

1. Analyze @.opencode/other/about-me.md to extract relevant information for the "About Me" section.
2. If present, analyze and extract relevant information from the job description provided in the `job-link` to tailor the "About Me" section accordingly.
3. Update under `data` folder, for each language, the attribute `aboutMe` in the JSON files with the updated content for the "About Me" section.
4. If job-link is provided, use the name of company as `CV_TAG` to generate CVs.
5. Run tests to ensure every constraints related to CV generation are met, and the CV is generated successfully.

## Constraints

- Write for HR and hiring managers first: emphasize scope, responsibilities and outcomes, not implementation details.
- Maintain the length of "About Me" section to ~900 characters (space included).
- Don't quantify years of experience, but focus on the quality and relevance of information provided.
- Don't invent any information, if you don't have enough information, please ask for more details.
