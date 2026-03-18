# Deployment Guide — CV Builder Group 30

## Frontend → Vercel

1. Push the `frontend/` folder to a GitHub repo (or use the monorepo root with Vercel's root directory setting)

2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub

3. Set:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend.railway.app/api
   ```

5. Click **Deploy** — Vercel auto-deploys on every push to `main`.

---

## Backend → Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub Repo

2. Select the repo and set **Root Directory** to `backend`

3. Add a **PostgreSQL** plugin inside Railway (click `+ New` → `Database` → `PostgreSQL`)

4. Railway automatically sets `DATABASE_URL` in your service environment.

5. Add the remaining environment variables in Railway's **Variables** tab:
   ```
   JWT_SECRET=your-long-random-secret-here
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   PORT=4000
   ```

6. In the **Settings** tab, set:
   - **Start Command:** `npm start`
   - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`

7. Railway deploys on push to `main`. Check logs in the Railway dashboard.

---

## Database Migrations

### Development
```bash
cd backend
npx prisma migrate dev --name init
```

### Production (Railway)
Railway runs `npx prisma migrate deploy` automatically as part of the build command above. For manual runs:
```bash
npx prisma migrate deploy
```

---

## Environment Variables Summary

### Frontend (`frontend/.env.local`)
| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` |

### Backend (`backend/.env`)
| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/cvbuilder_dev` |
| `JWT_SECRET` | `change-me-long-random-string` |
| `JWT_EXPIRES_IN` | `7d` |
| `PORT` | `4000` |
| `NODE_ENV` | `development` or `production` |
| `FRONTEND_URL` | `http://localhost:3000` |

---

## GitHub Branch Strategy

```
main          ← production-ready code, auto-deploys
develop       ← integration branch
feature/*     ← individual feature branches (e.g. feature/ats-engine)
fix/*         ← bug fix branches
```

**Pull Request rules:**
- All code merged to `main` via PR
- At least 1 reviewer approval required
- CI must pass (tests + lint)

---

## CI/CD (GitHub Actions)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: cvbuilder_test
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18' }
      - run: cd backend && npm ci
      - run: cd backend && npx prisma generate
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost:5432/cvbuilder_test
      - run: cd backend && npm test
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost:5432/cvbuilder_test
          JWT_SECRET: test-secret

  frontend-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18' }
      - run: cd frontend && npm ci
      - run: cd frontend && npm run lint
```
