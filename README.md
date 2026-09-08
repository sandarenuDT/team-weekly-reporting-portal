# Weekly Report Generator & Team Dashboard

Full-stack internal tool for weekly work reporting, manager review/correction workflows, and team analytics.

**Stack:** Spring Boot (Java 17) + MySQL — backend · Next.js (React, TypeScript, Tailwind) — frontend

## Repository structure

```
team-reporting-portal/
├── backend/     Spring Boot REST API
├── frontend/    Next.js app (team member + manager interfaces)
└── README.md
```

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+
- Docker (for MySQL) — or a local MySQL 8 instance

## 1. Installing dependencies

**Backend**
```bash
cd backend
mvn clean install
```

**Frontend**
```bash
cd frontend
npm install
```

## 2. Running the database

Using Docker (recommended):
```bash
cd backend
docker compose up -d
```
This starts MySQL 8 on `localhost:3306` with database `weekly_reports`, user `root`, password `root`.

If using a local MySQL install instead, create the database manually:
```sql
CREATE DATABASE weekly_reports;
```
and set connection details via `backend/.env` (see below) or directly in `application.yml`.

## 3. Running the backend

```bash
cd backend
cp .env.example .env   # edit values if needed
mvn spring-boot:run
```

The API starts on `http://localhost:8082` (configurable via `PORT`). Tables are created automatically on first run.

### Seeding demo data

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=seed
```
Run once — safe to re-run, it skips seeding if data already exists. Creates 1 manager, 5 team members, 4 projects, and several weeks of reports across all statuses.

**Demo accounts** (all passwords: `password123`):
| Role | Email |
|---|---|
| Manager | manager@company.com |
| Team member | alice@company.com, bilal@company.com, carla@company.com, dinesh@company.com, elena@company.com |

### Running tests
```bash
mvn test
```
Includes `RoleBasedAccessTest`, verifying team members cannot access other members' reports or manager-only endpoints.

## 4. Running the frontend

```bash
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL if different
npm run dev
```

The app starts on `http://localhost:3000`.

## Environment variables

**`backend/.env`**
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=weekly_reports
JWT_SECRET=change_this_to_a_long_random_string_at_least_32_bytes
JWT_EXPIRATION_MS=28800000
PORT=8082
FRONTEND_URL=http://localhost:3000
```

**`frontend/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:8082/api
```

## Core workflow

1. Team member creates a draft report for the current week and submits it.
2. Manager reviews it from the Reports page: approves, or requests changes with a required comment.
3. If changes are requested, the report becomes editable again; the team member edits and resubmits.
4. Every submission is preserved as a version — past versions remain viewable, each linked to the review comment made against it.
5. Concurrent reviews are protected with optimistic locking (`@Version` on the report entity) — a manager reviewing a report someone else just reviewed gets a clear conflict message rather than a silent overwrite.

## Key architectural decisions

- **`Report` vs `ReportVersion`** — a `Report` holds identity and current status only; each submit/resubmit creates a new `ReportVersion` snapshot rather than overwriting content, which is what makes version history possible.
- **Role-based access control** — enforced at two levels: `@PreAuthorize("hasRole('MANAGER')")` on manager-only endpoints, and explicit ownership checks inside services (`ReportService.assertOwner`) so a team member can never read or edit another member's report even with a crafted request.
- **Managers never edit report content** — `ReviewService.review()` only ever writes `Report.status` and creates a `ReviewComment` row; there is no code path from a manager action into `Task`/`Blocker`/`Achievement` content.

## Known limitations / possible future improvements

- Dashboard aggregate queries (recent activity, open blockers count) currently compute in-memory rather than via SQL aggregation — fine at seed-data scale, would move to native aggregate queries for a larger team.
- No email delivery for invites — admin-created accounts get a password directly rather than an invite link.
- AI chat assistant (optional, good-to-have) — not implemented in this submission.
- CSV export of the filtered reports table — not implemented, not required by spec.
