# iamconsistent.io

A simple, focused habit tracking application that helps users build consistency through daily logging and streak tracking.

## Overview

iamconsistent.io allows users to create habits and track their completion over time. Users can log habits daily, add optional notes, backfill missed days, and view their streaks and progress. The app supports two tracking modes: simple daily tracking and target-based tracking (e.g., "3 times per week").

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Database | Cloudflare D1 (SQLite at edge) |
| ORM | Drizzle |
| Validation | Zod |
| UI Components | shadcn/ui |
| Icons | Lucide |
| Auth & Payments | Clerk |
| ID Generation | nanoid |
| Date Utilities | date-fns |
| Notifications | sonner |

## Core Features

- Create and manage multiple habits
- Log habit completion for today or past dates
- Add optional notes to entries
- Delete incorrect entries
- View current and longest streaks
- Two tracking modes:
  - **Simple:** Daily tracking with consecutive day streaks
  - **Target:** X times per period (week/month) with consecutive period streaks

## Subscription Tiers

| Tier | Habits | Analytics |
|------|--------|-----------|
| Free | 2 | No |
| Pro | Unlimited | Yes |

## Database Schema

Three main tables:

- **users** - Clerk user ID, email, subscription tier
- **habits** - Name, icon, color, optional target settings (count + period)
- **entries** - Habit completion records with date and optional note

Streaks are calculated on read, not stored.

## Key Design Decisions

- Dates stored as ISO strings (`YYYY-MM-DD`) for simplicity
- Timezone handling done client-side (browser's local date)
- nanoid for URL-safe, collision-free IDs
- Soft delete via `isArchived` flag on habits
- User ID denormalized on entries for faster queries

## Future Considerations (v2)

- Shared habits with friends via invite codes
- Schema supports this via a `shared_habits` join table
- Each user maintains their own entries against shared habits

## Project Structure
```
/app
  /routes          # TanStack Start routes
  /components      # React components
  /lib
    /db            # Drizzle schema and client
    /streaks       # Streak calculation logic
    /subscription  # Tier limits and checks
```

## Commands
```bash
pnpm dev           # Start dev server
pnpm build         # Build for production
pnpm db:generate   # Generate Drizzle migrations
pnpm db:migrate    # Run migrations
```