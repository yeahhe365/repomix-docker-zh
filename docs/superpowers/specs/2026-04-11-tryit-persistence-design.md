# TryIt Persistence Design

## Goal

Persist the local TryIt workspace so returning users resume from their previous context instead of starting from defaults.

## Scope

Persist these states locally in the browser:

- active input mode
- remote repository input
- local path input
- pack options
- local path browser current directory
- local path browser selected directory
- local path browser scroll position

Do not persist uploaded file contents, pack results, or in-flight request state.

## Approach

Use browser-local storage for user-specific state while preserving the existing URL query parameter behavior for shareable repository and option links.

State restore priority:

1. URL query parameters
2. local persisted state
3. defaults

The local path browser uses its own persisted state so it can reopen at the previously browsed folder and restore selection and scroll independently of the main TryIt page state.

## UX Notes

- Returning to the page restores the last used tab and values.
- Clicking reset clears persisted page state and local path browser state.
- Opening the local path browser returns to the last visited directory with the previous selection restored when possible.

## Testing

- persistence helper round-trip tests
- merge precedence tests for URL params vs persisted state
- existing local path browser and pack tests remain as regression coverage
