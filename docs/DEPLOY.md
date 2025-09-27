## Deploy Guide

### Frontend on Vercel
1. Import `apps/frontend` as a project.
2. Build command: `pnpm i && pnpm --filter @adsrays/frontend build`
3. Output directory: `apps/frontend/dist`
4. Env: `VITE_API_BASE` pointing to backend URL (Render).

### Backend on Render
1. New Web Service from repo, root `apps/backend`.
2. Build: `pnpm i && pnpm build`
3. Start: `pnpm start`
4. Env vars: `PORT=4000`, `FORECAST_MODE=money`, `DEFAULT_NICHE=coffee`, CORS allowed origins.



