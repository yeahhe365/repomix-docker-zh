# Local Path Browser Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add local-path search, recent visited directories, and browser-level E2E coverage to the local path browser.

**Architecture:** Extend the existing browser navigation helpers and persistence helper, update the Vue dialog UI to render search and recent chips, and add Playwright-based end-to-end tests against the built static site.

**Tech Stack:** Vue 3, TypeScript, localStorage, Vitest, Playwright

---

### Task 1: Helper and Persistence Coverage

**Files:**
- Modify: `website/client/components/Home/localPathBrowserNavigation.ts`
- Modify: `website/client/utils/tryItPersistence.ts`
- Modify: `tests/website/localPathBrowserNavigation.test.ts`
- Modify: `tests/website/client/tryItPersistence.test.ts`

- [ ] Add failing tests for filtering directory entries and recent directory MRU behavior.
- [ ] Run targeted Vitest commands and verify failure.
- [ ] Implement the minimal helper and persistence extensions.
- [ ] Re-run the tests and verify they pass.

### Task 2: Browser Dialog Search and Recent Directories

**Files:**
- Modify: `website/client/components/Home/TryItLocalPathBrowser.vue`
- Modify: `website/client/components/Home/homeUiText.ts`
- Modify: `tests/website/homeUiText.test.ts`

- [ ] Add failing UI copy tests for search and recent directory labels.
- [ ] Run the text test and verify failure.
- [ ] Implement search input, filtered list logic, recent directory pills, and persistence updates.
- [ ] Re-run the tests and keep keyboard navigation working.

### Task 3: Playwright E2E

**Files:**
- Modify: `website/client/package.json`
- Create: `website/client/playwright.config.ts`
- Create: `website/client/tests/e2e/local-path-browser.spec.ts`

- [ ] Add Playwright as a dev dependency and a `test:e2e` script.
- [ ] Implement a browser test that mocks the directory API and verifies search plus recent-directory restore.
- [ ] Run the E2E test locally against the built site.

### Task 4: Verification

**Files:**
- Modify if needed: `website/compose.docker.yml`

- [ ] Run all targeted Vitest suites.
- [ ] Run `npm run lint-tsc` in `website/client`.
- [ ] Run `npm run docs:build` in `website/client`.
- [ ] Run the new Playwright E2E.
- [ ] Rebuild Docker and verify the polished browser manually at `http://localhost:5173`.
