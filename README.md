# Job Portal MVP

Phase 1 job portal built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase Auth/Postgres.

## Features

- Public landing page and open job browsing
- Job title, location, and job type filters
- Email/password auth with seeker and employer roles
- Seeker dashboard with submitted applications
- Employer dashboard with posted jobs and applicant lists
- Employer job posting flow with lazy company creation
- Supabase migration with tables, signup profile trigger, and RLS policies

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template and fill in your Supabase project values:

```bash
cp .env.local.example .env.local
```

3. Apply the database migration in Supabase:

```bash
supabase db push
```

The migration lives at `supabase/migrations/001_init.sql`.

4. Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Main Routes

- `/` - landing page
- `/jobs` - browse open jobs
- `/jobs/[id]` - job detail and seeker application action
- `/login` - email/password login
- `/signup` - role-based signup
- `/dashboard/seeker` - seeker applications
- `/dashboard/employer` - employer jobs
- `/dashboard/employer/post` - post a job
- `/dashboard/employer/jobs/[id]/applicants` - read-only applicant list

## Verification

Run a production build before deploying:

```bash
npm run build
```

This workspace currently needs Node/npm available on PATH for local verification.
