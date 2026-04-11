# Local Path Browser Design

## Goal

For local-only deployments, let the Web UI browse directories exposed by the local API and fill the selected absolute path into the existing local path input without uploading folder contents.

## Approach

The server adds a read-only directory browsing API gated by the existing local path mode and allowlist settings. The API exposes only directory metadata needed for navigation: current path, parent path, and child directories. File contents are never read or returned.

The client adds a lightweight directory picker dialog to the local path input. Users can open the dialog, navigate through allowlisted roots, choose the current folder, and have its absolute path written back into the existing local path field. Manual absolute path entry remains available.

## Server Design

- Reuse local path mode toggles from `website/server/src/domains/pack/localPath.ts`.
- Add a listing helper that:
  - returns allowlist roots when no path is provided
  - validates requested paths stay within allowed roots
  - lists only child directories
  - returns parent navigation metadata
- Add a new API endpoint for local directory browsing.
- Keep error handling consistent with existing JSON API responses.

## Client Design

- Extend the client API module with directory listing types and a fetch helper.
- Add a directory picker dialog component for the local path tab.
- Add a browse button beside the local path input.
- When a folder is chosen, update the existing local path model value.
- Preserve current submit, validation, and local-path packing behavior.

## UX Notes

- Root view shows allowed roots such as `/Users`.
- Directory view shows:
  - current path
  - “go up” when a parent is available
  - “select current folder”
  - child directory list
- The picker is local-deployment oriented and may expose hidden directories if they exist in the allowlisted tree.

## Testing

- Server tests for root listing and nested directory listing within the allowlist.
- Client tests for directory API base-url behavior and response parsing.
- Existing local path pack tests remain in place to verify the selected path still works end-to-end.
