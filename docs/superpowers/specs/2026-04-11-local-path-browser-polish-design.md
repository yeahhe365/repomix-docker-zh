# Local Path Browser Polish Design

## Goal

Finish the local path browser with the three most useful quality improvements:

- in-directory search
- recent visited directories
- browser-level E2E coverage

## Scope

This pass focuses on the local path browser only.

- Search filters visible child directories in the current folder
- Recent directories are persisted locally and restored across page refreshes
- Browser E2E verifies the core local-path flow from the built website

## Search Design

- Add a search field to the browser dialog
- Filter only the current directory listing, not the full filesystem tree
- Keep keyboard navigation working against the filtered result set
- When the current selection disappears due to filtering, select the first visible entry

## Recent Directories Design

- Persist a short MRU list in local storage
- Update the list when the user successfully enters or selects a directory
- Show recent directories near the top of the dialog as clickable pills
- Cap the list size to keep the UI compact

## E2E Design

- Use Playwright in `website/client`
- Serve the built VitePress output with a simple static server
- Mock `/api/local-path/directories` in the browser test
- Cover:
  - opening local path mode
  - browsing directories
  - filtering with search
  - selecting a directory
  - restoring recent directories after reload

## Out of Scope

- full recursive filesystem search
- server-side recent history
- persistence of upload file objects
