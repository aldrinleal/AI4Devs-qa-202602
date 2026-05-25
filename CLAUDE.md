# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LTI is a full-stack Talent Tracking System. The backend is an Express/TypeScript API with Prisma ORM connected to PostgreSQL. The frontend is a React (Create React App) application with drag-and-drop kanban-style interview pipeline management.

Ports: backend on **3010**, frontend on **3000**.

## Commands

### Backend (run from `backend/`)
```sh
npm run dev          # Start with ts-node-dev (hot reload)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled dist/index.js
npm test             # Run Jest tests
npx jest --testPathPattern=candidateService  # Run a single test file
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma migrate dev  # Apply migrations
ts-node prisma/seed.ts  # Seed the database
```

### Frontend (run from `frontend/`)
```sh
npm start   # Dev server on :3000
npm run build
npm test
```

### Infrastructure (run from root)
```sh
docker-compose up -d   # Start PostgreSQL on :5432
docker-compose down
```

## Architecture

### Backend — Layered DDD
```text
src/
  routes/            → Express routers (candidateRoutes, positionRoutes)
  presentation/controllers/  → Parse req/res, delegate to services
  application/services/      → Business logic (candidateService, positionService)
  domain/models/     → Prisma-backed domain classes (Candidate, Application, …)
  application/validator.ts   → Input validation
  index.ts           → Express app bootstrap, CORS, Prisma middleware
```

All routes are prefixed: `/candidates` and `/positions`. The key endpoint for the kanban is `PUT /candidates/:id` — it accepts `{ applicationId, currentInterviewStep }` and updates which pipeline stage a candidate is in.

### Frontend — React SPA
The main feature is the kanban board in `src/components/PositionDetails.js`:
- Fetches interview steps from `GET /positions/:id/interviewFlow`
- Fetches candidates from `GET /positions/:id/candidates` and distributes them into columns by `currentInterviewStep` name
- Uses `react-beautiful-dnd` for drag-and-drop; `onDragEnd` calls `PUT /candidates/:id` to persist the stage change

### Data Model
The pipeline flow is: `Position` → has an `InterviewFlow` → has ordered `InterviewStep`s. A `Candidate` applies via an `Application`, which tracks `currentInterviewStep` (FK to `InterviewStep`). `Interview` records are created per step per `Employee` interviewer.

### API spec
Full OpenAPI spec is at `backend/api-spec.yaml`.

## Database
PostgreSQL via Docker. Connection string is in `backend/prisma/schema.prisma` (hardcoded) and also in `backend/.env`. To reset and reseed:
```sh
npx prisma migrate reset
ts-node prisma/seed.ts
```

## Prompt log — `prompts/prompts-iniciales.md`

This file must be regenerated at the start and end of every session (and before any commit). Run from the repo root:

```sh
python3 ~/bin/list-prompts.py . \
  | sed 's/[a-zA-Z0-9._%+-]\+@[a-zA-Z0-9.-]\+\.[a-zA-Z]\{2,\}/[email redacted]/g' \
  > prompts/prompts-iniciales.md
```

The `sed` pass strips email addresses before the file is committed. Apply the same redaction to any other PII visible in prompt text (phone numbers, full names used as identifiers) before committing.
