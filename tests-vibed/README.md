# Automated Test Coverage

The Playwright suite runs against the Chromium project and starts the frontend and backend through the root `npm run dev` command.

## Coverage

| Area | Automated coverage | Test files |
| --- | --- | --- |
| Favicon | Link target and resource availability | `favicon/favicon.spec.ts` |
| Login | Form rendering, password masking, valid and invalid credentials, blank credentials, Enter submission, protected-route redirect, refresh persistence | `login/login.spec.ts`, `seed.spec.ts`, `api/api.spec.ts` |
| Title bar | Logo, title, search, New Bug, and Logout controls | `title-bar/title-bar.spec.ts` |
| Logout | Redirect and browser Back protection | `logout/logout.spec.ts` |
| Create bug | Modal controls, default owner, required-field validation, close behaviors, save, severity | `create-bug/*.spec.ts` |
| Bug board | Table columns, created rows, row-to-edit interaction | `board/board.spec.ts` |
| Severity | Uppercase rendering, severity sorting, and severity-specific board behavior | `board/sort-board.spec.ts`, `create-bug/create-modal.spec.ts` |
| Edit bug | Read-only ID, field loading, disabled Save, editing, state changes, cancel behavior | `edit-bug/edit-modal.spec.ts` |
| Sorting | Default severity order, direction toggle, active sort indicator, switching columns | `board/sort-board.spec.ts` |
| Search | Existing search flows plus case-insensitive, whitespace, punctuation normalization, clearing | `search-bug/*.spec.ts` |
| Bug status | Open default view, Closed view, and state-separated results | `bug-status/status-filter.spec.ts`, `create-bug/create-and-close.spec.ts` |
| Delete bug | Confirmation, confirmed deletion, cancellation, and deletion from details | `delete-bug/*.spec.ts` |
| REST API | Health, login validation, bug CRUD, normalization, invalid input, and default state | `api/api.spec.ts` |

## Run Commands

```bash
npx playwright test --project=chromium
npx playwright test tests/login tests/logout tests/board tests/create-bug tests/edit-bug tests/bug-status tests/search-bug --project=chromium
```

Tests create uniquely titled data and clean up API-created bugs where applicable so they remain independent of the existing database contents.
