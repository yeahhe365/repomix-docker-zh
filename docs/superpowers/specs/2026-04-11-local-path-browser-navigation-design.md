# Local Path Browser Navigation Design

## Goal

Upgrade the local path browser so it feels closer to a desktop folder picker while staying inside the existing Web UI.

## Scope

This iteration focuses on navigation ergonomics only:

- clickable breadcrumbs
- single-click selection and double-click directory entry
- fixed action bar with current-folder selection
- keyboard navigation for list traversal and folder entry
- clearer root-state and selected-state feedback

Search and recent-history are intentionally out of scope for this pass.

## Interaction Model

- The header keeps the dialog title plus a breadcrumb row for the current path.
- Breadcrumb segments are clickable and jump directly to the chosen ancestor.
- The directory list supports:
  - single click to select an entry
  - double click to enter the selected entry
  - keyboard focus movement with arrow keys
- Keyboard shortcuts:
  - `ArrowUp` / `ArrowDown`: move selection
  - `Enter`: enter selected directory
  - `Backspace`: go up one level
  - `Escape`: close dialog
  - `Meta+Enter` or `Ctrl+Enter`: select current folder
- The footer action bar stays visible while the list scrolls.

## Implementation Notes

- Extract navigation state into a small pure helper module so keyboard rules and breadcrumb generation can be tested without component mounting libraries.
- Keep the server API unchanged because the current directory listing payload already contains enough information for this navigation model.
- Preserve the existing browse button and path-selection callback contract.

## Testing

- Add unit tests for breadcrumb generation and keyboard navigation helpers.
- Keep existing API and local-path tests unchanged.
- Verify the dialog still builds in VitePress and runs in Docker.
