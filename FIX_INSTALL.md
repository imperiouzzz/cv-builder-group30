# Fix: Clean Reinstall After `npm audit fix --force`
# Run these commands in order from the project root (cv-builder/)

## The problem
# `npm audit fix --force` made three bad changes:
#   1. jsPDF 2.x → 4.x  (breaking API change — fixed in pdfFallback.ts)
#   2. eslint-config-next → 16.x  (needs eslint@9, we have eslint@8 — fixed in package.json)
#   3. next 14.1 → 14.2.35  (safe — same major, kept this upgrade)

## Frontend fix
cd frontend

# 1. Delete the broken node_modules and lock file
rmdir /s /q node_modules        # Windows
# rm -rf node_modules           # Mac/Linux

del package-lock.json           # Windows
# rm package-lock.json          # Mac/Linux

# 2. Fresh install using the corrected package.json
npm install

# 3. Verify — should show 0 breaking issues
npm audit

## Backend fix
cd ../backend

rmdir /s /q node_modules        # Windows
# rm -rf node_modules           # Mac/Linux

del package-lock.json           # Windows
# rm package-lock.json          # Mac/Linux

npm install

## After both installs succeed, start the dev servers:

# Terminal 1 — Backend
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials, then:
npx prisma migrate dev --name init
npm run db:seed
npm run dev

# Terminal 2 — Frontend
cd frontend
cp .env.example .env.local
npm run dev

# Open: http://localhost:3000
# Login: demo@cvbuilder.knust / demo1234
