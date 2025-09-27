## AdsRays Demo

Monorepo demo (SPA + API) showcasing ad diagnostics, forecasting, and quick audit.

### Tech Stack
- Frontend: React + Vite + TypeScript + TailwindCSS + Zustand + Recharts + i18n
- Backend: Node.js + Express + TypeScript
- PDF: pdfmake
- Tests: Vitest/RTL (frontend), Jest (backend)
- Lint/Format: ESLint + Prettier
- Docker: Dockerfiles + docker-compose

### Quick Start (Local)
1) Install dependencies
```
pnpm i
```
2) Dev mode (frontend + backend)
```
pnpm dev
```
Frontend: http://localhost:5173  API: http://localhost:4000

3) Build all
```
pnpm build
```
4) Start API (serves built frontend)
```
pnpm start
```

### Quick Start (Docker)
1) Build images
```
docker compose build
```
2) Run
```
docker compose up -d
```
Frontend: http://localhost:5173  API: http://localhost:4000

### Environment
Create `.env` in repo root or set OS env vars:
```
NODE_ENV=development
PORT=4000
FRONTEND_PORT=5173
FORECAST_MODE=money  # or percent (A/B flag)
DEFAULT_NICHE=coffee # options: coffee|cosmetics|fashion
```

### Workspaces
Uses pnpm workspaces.
```
pnpm -v
pnpm i
```

### CSV Sample
See `data/sample_meta.csv` for simplified columns used by the express audit.

### PDF Generation
- Endpoint: `POST /api/report/pdf`
- Returns a 2-page PDF buffer; client downloads as `adsrays-report.pdf`.

### Change Niche / Language
- Niche: change `DEFAULT_NICHE` or select in UI dropdown.
- Language: RU/EN toggle in header.

### Scripts
Top-level:
```
pnpm dev     # run FE+BE concurrently
pnpm build   # build FE and BE
pnpm start   # start backend (serves built FE)
pnpm test    # run all tests
pnpm lint    # run eslint
```

### Deployment
- Vercel (frontend): deploy `apps/frontend` build output (`dist/`) as static. API on Render.
- Render (backend): deploy `apps/backend` with `pnpm i && pnpm build && pnpm start`.

See `docs/DEPLOY.md` for step-by-step.



