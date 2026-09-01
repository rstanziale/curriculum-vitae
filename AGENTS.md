# AGENTS.md

> README for agents — predictable, portable instructions for any AI coding agent working in this repo. Complements `README.md` (human-facing). Keep this file as the single source of truth for repository-wide expectations; do not duplicate the same baseline elsewhere.

## Repository overview

Versioned single-page A4 CV generator. Typed JSON (`data/cv.*.json`) → Handlebars (`templates/cv.html`) → Playwright Chromium → `dist/CV_RBS_{LANG}-{tag}.pdf`.

Stack: TypeScript (ESM, strict) · Handlebars · Playwright · Ajv · Biome

## Repository map

- `data/` — CV content, one JSON per language + `cv.schema.json`
- `templates/` — Handlebars layout, BEM CSS, A4 grid (`@page`, `@font-face`)
- `assets/fonts/` — Montserrat TTF, embedded as `data:` URI at build time
- `src/config/` — centralized paths + `CV_TEMPLATE_NAME` (`src/config/paths.ts:3`) and `CV_TAG` (`src/config/tag.ts:1`)
- `src/data/` — loading, secret injection, Ajv validation
- `src/template/` — Handlebars registry/compiler
- `src/pdf/` — Playwright pipeline (options, viewport `794×1123`, font embedding, base-href)
- `src/utils/` — FS helpers, timing
- `src/errors/` — `ValidationError`
- `test/` — mirrors `src/` + `test/cv-integration.test.ts:19` (builds real PDFs, checks with `pdf-parse`)

Closest `AGENTS.md` wins in nested trees. This root file applies to the whole repo.

## Setup commands

- Install: `pnpm install`
- Browser (once): `npx playwright install chromium`
- Env: create `.env` at root (`CV_TAG`, `PERSONAL_PHONE`, `PERSONAL_EMAIL` — see `README.md`)
- Dev build: `pnpm run build:dev` (`node --env-file=.env src/index.ts`)
- Prod build: `pnpm run build:prod` (`node src/index.ts`)

## Code style

- **Formatter/Linter:** Biome `biome.json:33` — `indent 2`, `lineWidth 100`, `singleQuote`, `linter preset recommended`. Never bypass. Run `pnpm run lint` / `pnpm run lint:fix`.
- **TypeScript:** ESM, `erasableSyntaxOnly`, `verbatimModuleSyntax`, `rewriteRelativeImportExtensions` — `tsconfig.json:7`. Use `import ... from './x.ts'` with extension. Check with `pnpm run compile` (`tsc --noEmit`).
- **Functions:** Small (<40 LOC), single-responsibility, explicit names, early returns, no magic values. Centralize paths in `src/config/paths.ts:18`.
- **CSS/Template:** BEM in `templates/cv.html` — `block__element` / `block__element--modifier` (e.g. `cv__header`, `sidebar__list--grid`). Nested style mirrors BEM, CSS grid/flex only, no inline styles. New components get a new block, don't extend `sidebar` arbitrarily. Keep `@page`, `@font-face` at top.
- **PDF constraints:** A4 zero-margin (`src/pdf/options.ts:7`), viewport `794×1123` (`src/pdf/generator.ts:66`), height guard `src/pdf/viewport.ts:13`, base-href + font embedding for self-contained output (`src/pdf/generator.ts:94,119`). Target is strictly one page per language.

## Working agreement

- Prefer existing primitives/template blocks over custom styling.
- Do not introduce new dependencies without explaining why.
- Prefer pure core (`getPdfOptions`, `getCvTag(env)`, `extractLangFromPath`, `compileTemplate`, `validateCvData`, `discoverCvDataFiles`) with thin imperative shell (`build`, `generatePdf`, `loadCvData`). Inject `env`/`browser` instead of reading globals; `fs` is mocked, not injected.
- Keep tests beside code; add/update tests for changed behavior.
- Accessibility: PDFs must remain readable offline (embedded fonts, deterministic output).

## Testing instructions

- Framework: `node:test` + `node:assert/strict`.
- Mocking: `fs` via `mock.method(fs, ...)`; `Browser` via DI (`BrowserFactory` in `src/pdf/generator.ts:29`). Do not add `FileReader`/`DirReader` DI params for `fs`.
- Integration: `test/cv-integration.test.ts:19` is the gate — it builds real PDFs and asserts 1 page + surname presence. Treat it as the spec.
- Commands are executable — use them, don't paraphrase:

```bash
pnpm run compile
pnpm run lint
pnpm test
pnpm run build:dev  # smoke — generates dist/*.pdf
```

Report which checks ran, which failed, and which could not run before finishing.

## Security considerations

- Never commit `PERSONAL_PHONE` / `PERSONAL_EMAIL`. `data/*.json` uses `ENV_PHONE` / `ENV_EMAIL` placeholders replaced at load time (`src/data/loader.ts:54`).

## PR instructions

- Conventional Commits via commitlint `package.json:42` (`@commitlint/config-conventional`): `feat|fix|docs|refactor|test|chore: description`.
- Husky + lint-staged `package.json:47` runs `biome check --write` on `**/*.{js,ts,json,html}` pre-commit. Always run `pnpm run lint && pnpm test` before committing.
- Validate with the four checks above; PR should pass all before merge.

## When to add a SKILL.md

Repository-wide rules belong here. Procedures that apply only to a class of work (e.g. `design-to-component`, `pdf-layout-review`) belong in a `SKILL.md` with progressive disclosure (`name`/`description` ~100 tokens at startup, full body on activation, resources on demand) per [agentskills.io/specification](https://agentskills.io/specification). Start portable (`AGENTS.md`/`SKILL.md`) and add tool-specific layers (`.github/copilot-instructions.md`, `*.instructions.md`, `*.agent.md`, `*.prompt.md`) only when needed — and keep this file as the source of truth to avoid drift.
