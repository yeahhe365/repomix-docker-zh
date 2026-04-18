# Local Path Security Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Require explicit local path allowlisting before the website server exposes filesystem roots for browsing or packing.

**Architecture:** Keep the change inside the website server local path domain so the browser and pack endpoints inherit the same restriction. Add focused tests first for the unrestricted case, then implement the smallest server-side guard that returns a clear configuration error without changing the existing allowlist behavior.

**Tech Stack:** TypeScript, Vitest, Hono website server domain utilities

---

### Task 1: Guard Local Path Mode Without an Allowlist

**Files:**
- Modify: `website/server/src/domains/pack/localPath.ts`
- Test: `tests/website/server/localPathMode.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
it('rejects browsing roots when no allowlist is configured', async () => {
  process.env.ENABLE_LOCAL_PATH_MODE = 'true';

  await expect(listLocalPathDirectories()).rejects.toMatchObject({
    message: 'Local path browsing requires LOCAL_PATH_ALLOWLIST to be configured.',
    statusCode: 403,
  });
});

it('rejects packing a local directory when no allowlist is configured', async () => {
  process.env.ENABLE_LOCAL_PATH_MODE = 'true';

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repomix-local-pack-no-allowlist-'));

  await expect(processLocalPath(tempDir, 'plain', {})).rejects.toMatchObject({
    message: 'Local path access requires LOCAL_PATH_ALLOWLIST to be configured.',
    statusCode: 403,
  });

  await fs.rm(tempDir, { recursive: true, force: true });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/website/server/localPathMode.test.ts`
Expected: FAIL because unrestricted local path mode currently allows browsing from the filesystem root and allows packing any absolute directory.

- [ ] **Step 3: Write the minimal implementation**

```ts
function getAllowlistRoots(): string[] {
  const raw = process.env.LOCAL_PATH_ALLOWLIST?.trim();
  if (!raw) {
    return [];
  }

  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => path.resolve(item));
}

function assertLocalPathAllowlistConfigured(purpose: 'access' | 'browse'): string[] {
  const allowlistRoots = getAllowlistRoots();
  if (allowlistRoots.length === 0) {
    if (purpose === 'browse') {
      throw new AppError('Local path browsing requires LOCAL_PATH_ALLOWLIST to be configured.', 403);
    }
    throw new AppError('Local path access requires LOCAL_PATH_ALLOWLIST to be configured.', 403);
  }
  return allowlistRoots;
}
```

Call `assertLocalPathAllowlistConfigured('browse')` at the start of `listLocalPathDirectories()` and `assertLocalPathAllowlistConfigured('access')` inside `validateAndResolveLocalPath()`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- tests/website/server/localPathMode.test.ts`
Expected: PASS with the new unrestricted-case tests green and the existing allowlist tests still green.

- [ ] **Step 5: Run focused regression verification**

Run: `npm run test -- tests/website/server/localPathMode.test.ts tests/website/localPathInput.test.ts`
Expected: PASS to confirm the server restriction does not affect client-side absolute-path validation.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/plans/2026-04-18-local-path-security.md \
  tests/website/server/localPathMode.test.ts \
  website/server/src/domains/pack/localPath.ts
git commit -m "fix(website): Require local path allowlist"
```
