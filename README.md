# iamconsistent.io

A modern, full-stack habit tracking application built for consistency. Track your daily habits, share progress with friends, and build lasting routines with powerful analytics and social features.

## Overview

iamconsistent.io helps users build and maintain positive habits through intuitive tracking, visual feedback, and optional social accountability. Whether you're working out, meditating, writing, or pursuing any other goal, this app provides the tools to stay consistent and motivated.

## Key Features

### Habit Tracking
- **Flexible Habit Creation** - Create custom habits with icons, colors, and optional descriptions
- **Target Goals** - Set frequency targets (e.g., 3 times per week, daily, monthly)
- **Quick Logging** - One-click habit completion with optional notes
- **Entry Notes** - Add contextual notes to any logged entry and edit them later
- **Edit History** - Full ability to edit or delete past entries with inline note editing

### Analytics & Insights
- **Streak Tracking** - Monitor current and longest streaks for each habit
- **Activity Calendar** - GitHub-style contribution graph showing your consistency over time
- **Progress Visualization** - See your target completion rates at a glance
- **Historical Data** - Access complete history of all logged entries

### Social Features
- **Shared Habits** - Create habits that multiple users can track together
- **Invite System** - Share habits via unique invite codes
- **Friend Progress** - See how your friends are doing on shared habits
- **Leaderboards** - Compare progress with habit partners (coming soon)

### User Experience
- **Progressive Web App (PWA)** - Install on mobile devices for native-like experience
- **Dark Mode Design** - Easy on the eyes with a modern dark interface
- **Responsive Layout** - Seamless experience across desktop, tablet, and mobile
- **Real-time Updates** - Instant UI updates with optimistic rendering

### Admin Features
- **Admin Dashboard** - Protected analytics dashboard for platform administrators
- **User Management** - View all users with subscription tiers and join dates
- **Habit Analytics** - Browse all created habits across the platform
- **Trend Visualization** - Daily graphs showing user signups, habit creation, and entry logging
- **Role-Based Access** - Admin-only routes with database-level permission checks

## Tech Stack

### Frontend
- **[TanStack Start](https://tanstack.com/start)** - Full-stack React framework with file-based routing
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TanStack Query](https://tanstack.com/query)** - Powerful data fetching and caching
- **[TanStack Router](https://tanstack.com/router)** - Type-safe routing with loaders
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[date-fns](https://date-fns.org/)** - Modern date utility library
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Backend & Database
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Edge computing platform
- **[Cloudflare D1](https://developers.cloudflare.com/d1/)** - Serverless SQLite database at the edge
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe SQL ORM
- **[TanStack Start Server Functions](https://tanstack.com/start)** - Type-safe RPC-style API

### Authentication
- **[Clerk](https://clerk.com/)** - Complete user authentication and management
- **OAuth Support** - Sign in with Google, GitHub, and more
- **User Profiles** - Built-in profile management and avatars

### Developer Experience
- **TypeScript** - Full type safety across frontend and backend
- **Vite** - Lightning-fast build tool and dev server
- **Wrangler** - Cloudflare Workers CLI for local development and deployment
- **Vitest** - Fast unit testing framework
- **ESM** - Modern JavaScript module system

## Architecture

### Data Flow

1. **Client Request** → React component triggers TanStack Query
2. **Query Hook** → Calls TanStack Start server function
3. **Server Function** → Validates auth, queries D1 via Drizzle ORM
4. **Edge Response** → Data returned from nearest Cloudflare edge location
5. **Cache & UI Update** → TanStack Query caches and updates UI

### Key Design Patterns

- **Server Functions** - RPC-style API with automatic type inference
- **Optimistic Updates** - Instant UI feedback before server confirmation
- **Conditional Queries** - Data fetching only when needed (e.g., expanded cards)
- **Protected Routes** - Authentication and authorization checks at route level
- **Edge-First Architecture** - Global distribution with sub-50ms latency

## Development

### Prerequisites

- Node.js 18+ and pnpm
- Cloudflare account with D1 database
- Clerk account for authentication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

Built with modern web technologies and deployed on Cloudflare's edge network for optimal performance worldwide.
