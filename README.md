# VC Compliance Platform

A full-stack web application for venture capital firms ("Covered Entities") to comply with California's **Fair Investment Practices by Venture Capital Companies Law** (Corp. Code, § 27500 et seq.).

## Core Workflows

1. **Survey Distribution** - Send the DFPI-mandated Venture Capital Demographic Data Survey to founding team members of portfolio companies
2. **Response Collection & Storage** - Securely collect and store voluntary, anonymized survey responses
3. **Annual Report Generation** - Aggregate all responses received in a calendar year and generate a completed DFPI Venture Capital Demographic Data Report

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js (credential-based for VC firms, magic link for founders)
- **Email:** Resend (for survey distribution)
- **Testing:** Jest with ts-jest

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)

### Setup

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Copy the environment file and configure:
```bash
cp .env.example .env
# Edit .env with your database URL and API keys
```

3. Start PostgreSQL (using Docker):
```bash
docker compose up db -d
```

4. Generate Prisma client and run migrations:
```bash
npm run db:generate
npm run db:push
```

5. Seed the database with sample data:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

7. Open http://localhost:3000 and sign in with:
   - Email: `admin@example.com`
   - Password: `password`

### Docker Compose (Full Stack)

```bash
docker compose up
```

This starts both the PostgreSQL database and the Next.js application.

## Project Structure

```
/src
  /app
    /(authenticated)    - Authenticated pages (dashboard, portfolio, investments, surveys, reports)
    /api                - API routes
    /survey/[token]     - Public survey completion form
    /login              - Login page
  /components
    /ui                 - Reusable UI components (button, card, table, etc.)
    /layout             - Layout components (sidebar, header)
    /survey-form.tsx    - The DFPI survey form component
    /report-tables.tsx  - Report display tables
  /lib
    /aggregation.ts     - All report calculation logic
    /auth.ts            - NextAuth configuration
    /db.ts              - Prisma client
    /email.ts           - Email sending utilities
    /pdf.ts             - PDF report generation (HTML)
    /survey-helpers.ts  - Diverse founder determination logic
    /validations.ts     - Zod schemas
  /generated/prisma     - Generated Prisma client (gitignored)
/prisma
  schema.prisma         - Database schema
  seed.ts               - Seed data script
/__tests__
  aggregation.test.ts   - Unit tests for aggregation logic
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |

## Key Features

### Survey Form (`/survey/[token]`)
- Public-facing form matching the DFPI's official survey
- Multiple selections allowed per demographic category
- "Decline to state" disables other options in that category
- "Decline to state for all" disables all checkboxes
- Token-based access (no login required)
- Single-use tokens prevent duplicate submissions

### Report Generation (`/reports/[year]`)
- **Part I:** Aggregated demographic data counts
- **Part II:** "Primarily Founded by Diverse Founding Team Members" calculations
  - Investment count and dollar amount percentages
  - Per-demographic-category breakdown (A: by count, B: by dollars)
- **Part III:** Investment details table
- PDF export (opens printable HTML in new tab)

### Statutory Compliance
- Implements the statutory formula for "primarily diverse" determination
- Enforces voluntary participation language
- Excludes passive investors from surveys
- Only shows aggregated data (never individual responses)

## Testing

Run the test suite:
```bash
npm test
```

Tests cover:
- Diverse founder determination logic
- "Primarily diverse" team calculations
- Part I demographic aggregation
- Part II investment percentage calculations
- Part II Item 3 per-category breakdowns
- Edge cases (zero data, all declines, single founders)

## License

Private - All Rights Reserved
