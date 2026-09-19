---
name: content-tailoring
description: Guidelines and rules for customizing, rephrasing, and emphasizing work experiences and profile summaries based on a target Job Description, ensuring strict compliance with cv.schema.json.
---

# Skill: Content Tailoring

Use this skill when modifying CV sections (`aboutMe`, `workExperience`) to closely match the key requirements, terminology, and tech stack extracted from a target Job Description (JD). 

All content modifications MUST strictly comply with the structural and type constraints defined in `cv.schema.json`.

## 1. Source of Truth

- `.opencode/other/about-me.md` to extract relevant information for the "About Me" section.
- every `.opencode/experiences/<ORDER>-<COMPANY>.md` to extract relevant information for the "Work Experiences" section:
    - where `<ORDER>` is the order of the experience and `<COMPANY>` is the name of the company. Analyze them in reverse order and focus on the most recent experiences first.

## 2. Schema Structural Compliance (`cv.schema.json`)

When preparing updates for any CV section, ensure the data conforms precisely to `cv.schema.json`.

E.g., for `workExperience`:
  - Each item in the `workExperience` array must be an object with required properties: `company`, `period`, `role`, `techStack`, and `highlights`.
  - **`techStack`**: Must be an array of strings representing tools/technologies (e.g., `["Java", "Vert.x", "Docker"]`).
  - **`highlights`**: Must be an array of objects. Each highlight object **MUST contain both `title` and `description` string properties**:
    ```json
    {
      "title": "Short Impact Title or Area",
      "description": "Action-driven explanation with context, tools used, and results achieved."
    }
    ```
- **Strict Typing**: Do NOT pass raw strings into `highlights` or `techStack`. Always match the schema array-of-objects structure.

## 3. Core Content Principles

1. **Impact-Driven Action Statements**:
   - Begin every highlight `description` with a strong action verb (e.g., *Designed, Architected, Refactored, Onboarded, Streamlined*).
   - Use the **Action + Context + Quantifiable Result** pattern whenever possible.

2. **Keyword & Tech Stack Alignment**:
   - Naturally integrate key terms, frameworks, and architecture patterns requested by the JD (e.g., *Vert.x, Angular, Docker, Kubernetes, Contract-First API Design, JSON Schema*) into relevant role descriptions.
   - Do NOT fabricate work experience or tools you have not used. Reframe real project outcomes using the JD's vocabulary.

3. **Space & Density Constraints (Conciseness)**:
   - Keep `highlights` concise and punchy (typically 12 to 25 words per description).
   - Prioritize high-impact engineering accomplishments (architecture, optimization, onboarding leadership, automated testing) over generic daily maintenance tasks.
   - Avoid filler words or passive voice (*"was responsible for"*, *"helped with"*).

4. **Tone & Style**:
   - Maintain a professional, technical, and authoritative tone suitable for senior/lead software development roles.