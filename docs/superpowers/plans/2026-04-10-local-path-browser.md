# Local Path Browser Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local-only directory browser so users can pick an allowlisted folder in the Web UI and fill the absolute path into the existing local path mode.

**Architecture:** Add a read-only directory listing endpoint on the server and a small directory picker dialog on the client. Reuse the existing local path mode gate and keep packing behavior unchanged after path selection.

**Tech Stack:** Hono, Node.js `fs/promises`, Vue 3, VitePress, Vitest

---

### Task 1: Server Directory Listing

**Files:**
- Modify: `website/server/src/domains/pack/localPath.ts`
- Modify: `website/server/src/index.ts`
- Create: `website/server/src/actions/localPathBrowseAction.ts`
- Test: `tests/website/server/localPathMode.test.ts`

- [ ] Add a failing server test for browsing allowlist roots.
- [ ] Run `npm run test -- tests/website/server/localPathMode.test.ts` and verify it fails for the missing listing helper.
- [ ] Implement the minimal directory listing helper and API action.
- [ ] Run `npm run test -- tests/website/server/localPathMode.test.ts` and verify the new cases pass.

### Task 2: Client Directory Browser API

**Files:**
- Modify: `website/client/components/api/client.ts`
- Test: `tests/website/client/localPathBrowser.test.ts`

- [ ] Add a failing client test for fetching directory listings from the local API.
- [ ] Run `npm run test -- tests/website/client/localPathBrowser.test.ts` and verify it fails before implementation.
- [ ] Implement the minimal fetch helper and types.
- [ ] Run the same test again and verify it passes.

### Task 3: Local Path Picker UI

**Files:**
- Create: `website/client/components/Home/TryItLocalPathBrowser.vue`
- Modify: `website/client/components/Home/TryItLocalPathInput.vue`
- Modify: `website/client/components/Home/homeUiText.ts`
- Test: `tests/website/homeUiText.test.ts`

- [ ] Add a failing text test for the new Chinese and English UI copy.
- [ ] Run `npm run test -- tests/website/homeUiText.test.ts` and verify it fails.
- [ ] Implement the dialog, browse button, and path selection wiring.
- [ ] Run `npm run test -- tests/website/homeUiText.test.ts` and verify it passes.

### Task 4: Verification

**Files:**
- Modify if needed: `website/compose.docker.yml`

- [ ] Run targeted tests for server and client local-path browsing.
- [ ] Run `npm run docs:build` in `website/client`.
- [ ] Rebuild Docker with `docker compose -f website/compose.docker.yml up --build -d`.
- [ ] Verify folder browsing works from `http://localhost:5173`.
