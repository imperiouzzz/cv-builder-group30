# CV Builder — Group 30 · KNUST

A full-stack ATS-optimised CV creation platform built as a capstone project for CSM399 (Web-Based Concept and Development).

## Project Info
- **Project Code:** GRP30-2025-CVB
- **Institution:** Kwame Nkrumah University of Science & Technology (KNUST)
- **Project Manager:** Osmond Abdul-Karim Woriwi
- **Duration:** 1 March – 30 March 2025

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Next.js 14 (App Router) |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| PDF | Puppeteer (server-side) + jsPDF (client fallback) |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway / Render |
| Version Control | GitHub |
| Design | Figma |

## Project Structure

```
cv-builder/
├── frontend/          # Next.js 14 App Router application
│   ├── app/           # App Router pages & layouts
│   ├── components/    # Reusable React components
│   ├── lib/           # Utilities, API client, CV parser
│   ├── hooks/         # Custom React hooks
│   ├── store/         # Zustand global state
│   ├── types/         # TypeScript type definitions
│   └── public/        # Static assets
│
├── backend/           # Node.js + Express REST API
│   ├── src/
│   │   ├── routes/    # Express route handlers
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Auth, validation, error handling
│   │   ├── services/    # ATS engine, PDF generator, etc.
│   │   ├── prisma/      # DB schema & migrations
│   │   └── utils/       # Helpers
│   └── tests/           # Jest test suites
│
└── docs/              # Project documentation
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/group30-knust/cv-builder.git
cd cv-builder

# Install frontend deps
cd frontend && npm install

# Install backend deps
cd ../backend && npm install
```

### 1b. Fix Dynamic Route Folder (required after clone)
```bash
# Rename the builder page folder so Next.js recognises it as a dynamic route
mv frontend/app/builder/id "frontend/app/builder/[id]"
```

### 2. Environment Variables

**Frontend** — create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Backend** — create `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cvbuilder"
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run Development Servers
```bash
# Terminal 1 — Backend (port 4000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

## Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
```

### Backend → Railway
1. Push to GitHub
2. Connect repo on railway.app
3. Set environment variables in Railway dashboard
4. Railway auto-deploys on push to `main`

## Team
| Name | Role |
|------|------|
| Osmond Abdul-Karim Woriwi | Project Manager |
| Odjidja Steve Nartey | UI/UX Designer |
| Boahen Oliver | UI/UX Designer |
| Samuel Adom Quayson | Frontend Developer |
| Isaac Owusu Darko | Frontend Developer |
| Appiah Boahemah Belinda | Frontend Developer |
| Okang-Mensah Maurus | Backend Developer |
| Amoako-Ayim Andrews | Backend Developer |
| Owusu Jones Amofa | Backend Developer |
| Micheal Oti Yamoah | QA / Tester |
