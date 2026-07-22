# AGENTS.md

## Repo structure

Two independent packages at `frontend/` and `backend/`. No root `package.json` or workspace config — install and run commands from each directory separately.

- **Backend**: Express 5 + Supabase (ESM). Entry: `backend/server.js` → `backend/app.js`. Layered: `routes/` → `controllers/` → `services/` → `models/` → Supabase client (`config/db.js`).
- **Frontend**: React 19 + Vite 8 + React Router 7 (ESM). Entry: `frontend/src/main.jsx` → `frontend/src/App.jsx`. Pages in `src/pages/`, components in `components/`, API clients in `src/API/`.

## Running

### Backend (port 3000)
```sh
cd backend && npm install && npm run dev
```
Loads `.env` via `dotenv` at startup. Env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT`.

### Frontend (port 5173)
```sh
cd frontend && npm install && npm run dev
```
Vite proxies `/api` to `http://127.0.0.1:3000` (configurable via `E2E_API_TARGET` env var).

## Commands

### Frontend
| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server (port 5173, strict) |
| `npm run build` | Production build |
| `npm run test` / `npm run test:unit` | Vitest unit tests (jsdom) |
| `npm run test:e2e` | Playwright E2E (headless, auto-starts both servers) |
| `npm run test:e2e:debug` | Playwright E2E with debugger |

### Backend
| Command | What it does |
|---|---|
| `npm run dev` | Node server (port 3000) |
| `npm start` | Same as dev |
| `npm test` | Vitest (all unit tests, mocked models) |
| `npm run lint` | ESLint |

## Testing

### Unit tests
- **Frontend**: Vitest + jsdom + Testing Library + MSW. Setup file: `tests/setupTests.js`. Mock API handlers in `tests/sample-backend/`. Excludes `tests/e2e/**`.
- **Backend**: Vitest (node env). Unit tests in `test/unit/` — all use `vi.mock()` to mock models. No real DB access.

### E2E tests
- Playwright (Chromium only). Config: `frontend/playwright.config.js`.
- `globalSetup.js` auto-starts both backend and frontend servers; `globalTeardown.js` stops them.
- If servers are already running on expected ports, the setup reuses them.
- Process cleanup uses `taskkill /T /F` on Windows.
- Timeout: 120s per test, 30s expect timeout.

## Key gotchas

- **ESM everywhere**: Both packages use `"type": "module"`. Use `import`/`export`, not `require`.
- **No root install**: Must `cd` into `frontend/` or `backend/` to install/run.
- **Supabase client**: Created in `config/db.js` using service role key. The `.env` file is committed to the repo with real credentials.
- **Vite proxy**: Frontend dev server proxies `/api/*` to the backend. Do not hardcode absolute backend URLs in frontend API code.
- **Port strictness**: Both Vite (5173) and backend (3000) use strict ports — they will fail if the port is already in use.
- **Backend unit tests are fully mocked**: All `test/unit/*.test.js` files mock their model dependencies with `vi.mock()`. They do not hit Supabase.
- **Integration/API tests hit real DB**: `test/integration/*` and `test/API/*` use real Supabase connections.

## API routes (all under `/api/`)

`orders`, `payments`, `staff`, `branches`, `analytics`, `decision-support`, `customers`, `inventory`, `settings`

Each route module follows the same pattern: `*Routes.js` → `*Controller.js` → `*Service.js`, with `*Model.js` for Supabase queries.
