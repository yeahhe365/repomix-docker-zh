# Local Path Browser Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the local path browser feel like a desktop-style folder picker with breadcrumbs, selection state, and keyboard navigation.

**Architecture:** Keep the existing directory API, add a small pure navigation helper for testable selection logic, and update the dialog UI to render breadcrumbs and a fixed action footer.

**Tech Stack:** Vue 3, TypeScript, VitePress, Vitest

---

### Task 1: Navigation Helpers

**Files:**
- Create: `website/client/components/Home/localPathBrowserNavigation.ts`
- Create: `tests/website/localPathBrowserNavigation.test.ts`

- [ ] Write failing tests for breadcrumb generation and keyboard selection movement.
- [ ] Run `npm run test -- tests/website/localPathBrowserNavigation.test.ts` and verify failure.
- [ ] Implement the minimal helper functions.
- [ ] Re-run the test and verify it passes.

### Task 2: Browser Dialog Interaction Upgrade

**Files:**
- Modify: `website/client/components/Home/TryItLocalPathBrowser.vue`
- Modify: `website/client/components/Home/homeUiText.ts`
- Modify: `tests/website/homeUiText.test.ts`

- [ ] Add failing text tests for the new navigation copy.
- [ ] Run the text test and verify failure.
- [ ] Implement breadcrumbs, selected row state, double-click entry, keyboard shortcuts, and fixed footer actions.
- [ ] Re-run the text test and targeted navigation tests.

### Task 3: Verification

**Files:**
- Modify if needed: `website/client/components/Home/TryItLocalPathInput.vue`

- [ ] Run targeted tests for local path browser navigation.
- [ ] Run `npm run lint-tsc` in `website/client`.
- [ ] Run `npm run docs:build` in `website/client`.
- [ ] Rebuild Docker and verify the upgraded browser at `http://localhost:5173`.
