# Quiz Builder

Quiz Builder is a monorepo with a NestJS backend, a Next.js frontend, and PostgreSQL storage for quizzes.

## Stack

- Frontend: Next.js 16, React 19, TanStack Query v5, Tailwind CSS 4
- Backend: NestJS 11, Prisma 6, PostgreSQL 15
- Tooling: TypeScript, pnpm workspaces, Turborepo, ESLint, Prettier

## What You Can Do

- Browse a dashboard of quizzes loaded from the database
- Open a quiz detail page and inspect all questions
- Create quizzes with boolean, input, and checkbox questions
- Delete quizzes from the dashboard
- Seed demo data into PostgreSQL for a quick start

## Quick Start

1. Install dependencies.

```bash
pnpm install
```

2. Start PostgreSQL.

```bash
docker compose up -d postgres
```

3. Create local environment files.

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env.local
```

4. Generate the Prisma client.

```bash
pnpm --filter backend exec prisma generate
```

5. Push the Prisma schema if you need a direct sync.

```bash
pnpm --filter backend exec prisma db push
```

6. Run the database migration.

```bash
pnpm --filter backend exec prisma migrate dev
```

7. Seed demo quizzes.

```bash
cd backend && pnpm prisma db seed
```

8. Start the app.

```bash
pnpm turbo run dev
```

## Useful URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:3002

## Notes

- The frontend reads the API base URL from `frontend/.env.local`.
- The backend reads `DATABASE_URL` from `backend/.env`.
