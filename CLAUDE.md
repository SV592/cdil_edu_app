# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CDIL Education App - A Learning Management System (LMS) for the Caribbean Development Institute of Longevity, built with Next.js 16 App Router, TypeScript, PostgreSQL, and Tailwind CSS.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Database Setup

PostgreSQL database with connection pooling (max 20 connections). Configuration via environment variables:

**Option 1: Connection string**
- `DATABASE_URL` - Full PostgreSQL connection string

**Option 2: Individual parameters**
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password

**Seed data:** Run `/database/seed-sample-data.sql` to populate sample data including users, courses, enrollments, lessons, and assignments.

## Architecture

### Directory Structure

- `app/` - Next.js App Router pages and layouts
  - `actions/` - Server Actions for data mutations (auth, courses, etc.)
  - `components/` - React components (organized by feature)
  - `types/` - TypeScript type definitions
- `lib/` - Shared utilities and business logic
  - `db.ts` - PostgreSQL connection pool and query utilities
  - `auth.ts` - Authentication helpers and user management
  - `data/` - Data access layer
- `database/` - SQL schema and seed files

### Authentication & Authorization

**Current Implementation:** Cookie-based authentication with mock users (development only)

- Cookie name: `cdil_user_session` (stores user ID)
- Cookie lifespan: 7 days
- Mock users defined in `lib/auth.ts`

**Roles:**
- `superadmin` - Full system access
- `admin` - Instructor role with course management
- `user` - Student role with limited access

**Key Functions:**
- `getCurrentUser()` - Get authenticated user or redirect to login
- `getUserOrNull()` - Get authenticated user without redirect
- `isStudent()`, `isInstructor()`, `isSuperAdmin()` - Role checks

### Data Layer

**Database access:** Use `lib/db.ts` utilities:
- `getPool()` - Get connection pool instance
- `query(text, params)` - Execute parameterized queries
- `getClient()` - Get individual client for transactions

**Server Actions pattern:** All data mutations through `app/actions/` Server Actions marked with `'use server'` directive.

### Component Architecture

**Layout Pattern:**
- Root layout (`app/layout.tsx`) checks authentication
- Authenticated users get `AuthenticatedLayout` with sidebar
- Unauthenticated users see public pages (login)

**Server vs Client Components:**
- Default to Server Components for data fetching
- Client Components (`'use client'`) only when needed for:
  - State management (useState, useReducer)
  - Event handlers
  - Browser APIs
  - Interactive features (Sidebar, modals, forms)

**Role-based Navigation:**
- Sidebar (`app/components/Sidebar.tsx`) shows menu items based on user role
- Menu items defined with `roles` array to control visibility

### Data Model

Key entities (see `/database/seed-sample-data.sql` for full schema):

- **users** - Base user table (all roles)
- **students** - Student profiles (role='user')
- **instructors** - Instructor profiles (role='admin')
- **courses** - Course catalog with metadata
- **modules** - Course modules containing lessons
- **lessons** - Individual lessons (video, text, interactive)
- **materials** - Course/module/lesson resources
- **course_enrollments** - Student-course relationships
- **course_assignments** - Assignments with submissions
- **student_lesson_attendance** - Attendance tracking

### Pagination

Server-side pagination implemented in courses list:
- Default page size: 12 courses
- Uses PostgreSQL LIMIT/OFFSET
- See `lib/data/courses.ts` and `app/actions/courses.ts`

## Import Aliases

TypeScript path alias `@/*` maps to project root, allowing imports like:
```typescript
import { getCurrentUser } from '@/lib/auth';
import type { Course } from '@/app/types/course';
```

## Styling

Tailwind CSS 4 with PostCSS. Global styles in `app/globals.css`. FontAwesome icons via `@fortawesome/react-fontawesome`.
