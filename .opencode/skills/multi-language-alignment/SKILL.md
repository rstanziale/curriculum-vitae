---
name: multi-language-alignment
description: Rules for translating, synchronizing, and maintaining domain-specific consistency across all supported languages in the master CV JSON.
---

# Skill: Multi-Language Alignment

Use this skill whenever changes are made to a CV entry in one language (e.g., Italian) to ensure those updates are accurately localized and synchronized across all target languages (e.g., `ita`, `eng`) within `cv.${lang}.json`.

## Core Principles

1. **Domain-Specific Localization (Not Literal Translation)**:
   - Translate intent and technical terminology according to industry norms in the target language.
   - Preserve standard international IT terms in English when universally accepted in tech environments (e.g., *CI/CD pipelines, Docker containerization, monorepo, front-end architecture, reactive microservices*).

2. **Structural & Quantifier Parity**:
   - Maintain the exact same number of bullet points (`highlights`) and items in the `techStack` across all languages for a given `workExperience` entry.
   - Ensure metrics, dates, percentages, and numerical figures match identically across all language nodes (e.g., *"reduced build time by 35%"* must convey *35%* in all localized versions).

3. **Grammatical & Contextual Nuances**:
   - **English (`eng`)**: Use active past tense verbs for previous roles (*"Architected"*, *"Led"*) and present tense for current roles.
   - **Italian (`ita`)**: Use past tense or clear action-oriented nouns/verbs (*"Sviluppato"*, *"Progettato"*, or *"Progettazione di"*), maintaining stylistic consistency throughout the document.

4. **Character & Line Length Balance**:
   - Be mindful that languages like German or French often produce longer text strings than English or Italian.
   - Adjust word choices in longer languages to prevent paragraph overflow when rendered into a single-page PDF template.
