# TryIt Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the TryIt page and local path browser to the user’s previous local state on revisit.

**Architecture:** Add pure persistence helpers for page state and local path browser state, wire them into the existing composables and components, and preserve URL query parameter precedence for shareable links.

**Tech Stack:** Vue 3, TypeScript, localStorage, Vitest

---

### Task 1: Persistence Helpers

**Files:**
- Create: `website/client/utils/tryItPersistence.ts`
- Create: `tests/website/client/tryItPersistence.test.ts`

- [ ] Write failing tests for page-state round-tripping and URL-priority restore logic.
- [ ] Run `npm run test -- tests/website/client/tryItPersistence.test.ts` and verify failure.
- [ ] Implement helper functions for page state and local path browser state.
- [ ] Re-run the test and verify success.

### Task 2: Page-State Restore

**Files:**
- Modify: `website/client/composables/usePackRequest.ts`
- Modify: `website/client/components/Home/TryIt.vue`

- [ ] Restore remote URL, local path, mode, and pack options on mount.
- [ ] Persist updates when the page state changes.
- [ ] Clear persisted state on reset.

### Task 3: Local Path Browser Restore

**Files:**
- Modify: `website/client/components/Home/TryItLocalPathBrowser.vue`

- [ ] Restore last directory, selected item, and scroll position on browser open.
- [ ] Persist directory, selection, and scroll updates during navigation.
- [ ] Keep existing keyboard and breadcrumb navigation working.

### Task 4: Verification

**Files:**
- Modify if needed: `website/client/components/Home/TryItLocalPathInput.vue`

- [ ] Run targeted client and server tests.
- [ ] Run `npm run lint-tsc`.
- [ ] Rebuild client docs output and Docker images.
- [ ] Verify state is restored after refreshing `http://localhost:5173`.
