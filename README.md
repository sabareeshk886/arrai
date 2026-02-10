# Arrai CRM - Agency Delivery Management System

A comprehensive CRM system built for creative + tech agencies to manage client onboarding, projects, services, and team collaboration.

## Features

### MVP (Current)
- ✅ **Role-Based Access Control** - Super Admin, Team Member, and Client roles with granular permissions
- ✅ **Client Onboarding** - Automated onboarding workflow with checklist tracking
- ✅ **Project Management** - Client → Project → Service → Task hierarchy
- ✅ **Dashboard** - Real-time stats and project overview
- 🚧 **Service Tracking** - Manage services (Branding, Website, App, Video, Content, CRM)
- 🚧 **Timeline Views** - Visual project timelines and progress tracking
- 🚧 **File Management** - Google Drive integration
- 🚧 **Communication** - Commenting system and activity logs
- 🚧 **Notifications** - Email and in-app notifications

### Planned Features
- Advanced finance automation
- Change request management
- Resource capacity tracking
- AI-powered insights
- Client satisfaction scoring

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS + Custom Design System
- **Authentication**: NextAuth.js with credentials provider
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Radix UI components
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud like Neon/Supabase)
- Git

## Getting Started

### 1. Clone and Install

```bash
# Navigate to project directory
cd d:/arrai

# Install dependencies (already done)
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/arrai_crm?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Generate secret with:
# npx auth secret
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 4. Create Initial Admin User

You'll need to create an admin user directly in the database or use Prisma Studio:

```bash
npx prisma studio
```

Then manually create a user with:
- Email: your-email@example.com
- Password: (bcrypt hash - use online tool or script)
- Role: SUPER_ADMIN

Or use this seed script:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.user.create({
    data: {
      email: 'admin@arrai.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'SUPER_ADMIN'
    }
  })
}

main()
```

Run with: `npx tsx prisma/seed.ts`

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
arrai/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   └── clients/         # Client API endpoints
│   ├── dashboard/           # Main dashboard
│   ├── clients/             # Client management pages
│   ├── login/               # Authentication pages
│   └── globals.css          # Global styles
├── components/
│   └── ui/                  # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── status-badge.tsx
│       └── progress-bar.tsx
├── lib/
│   ├── prisma.ts            # Prisma client
│   ├── utils.ts             # Utility functions
│   └── permissions.ts       # RBAC helpers
├── prisma/
│   └── schema.prisma        # Database schema
├── types/
│   └── next-auth.d.ts       # Type definitions
└── auth.ts                  # NextAuth configuration
```

## Database Schema

### Core Hierarchy
```
Client
└── Project
    └── Service
        └── Task
```

### Key Models
- **User** - Team members and client users with role-based access
- **Client** - Company/organization profiles
- **Project** - Client projects with multiple services
- **Service** - Specific deliverables (Branding, Website, etc.)
- **Task** - Granular work items with visibility controls
- **OnboardingChecklist** - Client onboarding progress
- **ActivityLog** - Audit trail of all actions

## User Roles & Permissions

### Super Admin
- Full access to all features
- User management
- Analytics and reporting
- Client and project CRUD

### Team Member
- View all clients and projects
- Edit assigned projects/services
- Create and manage tasks
- View analytics

### Client
- View own projects only
- See client-visible tasks and milestones
- Access shared files
- Comment and approve deliverables
- **Cannot see**: Internal tasks, team notes, other clients

## Development Workflow

1. **Make changes** to code
2. **Test locally** with `npm run dev`
3. **Run database migrations** if schema changed: `npx prisma migrate dev`
4. **Commit changes** to Git
5. **Deploy** to production (Vercel recommended)

## Deployment

### Recommended Stack
- **Frontend + API**: Vercel
- **Database**: Neon or Supabase (PostgreSQL)
- **File Storage**: Google Drive API

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - DATABASE_URL
# - NEXTAUTH_URL
# - NEXTAUTH_SECRET
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Auth secret key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth (future) | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth (future) | No |
| `RESEND_API_KEY` | Email service (future) | No |

## Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma generate  # Generate Prisma Client
npx prisma migrate dev  # Run migrations
npx prisma studio    # Open database GUI

# Linting
npm run lint         # Run ESLint
```

## Current Status

**Version**: 0.1.0 (MVP in development)

**Completed**:
- ✅ Authentication system with NextAuth
- ✅ Role-based access control
- ✅ Client management (create, list, view)
- ✅ Client onboarding checklist
- ✅ Dashboard with stats
- ✅ Responsive UI with Tailwind

**In Progress**:
- 🚧 Project creation and management
- 🚧 Service tracking
- 🚧 Task management
- 🚧 Timeline visualization

**Next Steps**:
- Project CRUD operations
- Service management with status tracking
- Task assignment and tracking
- Google Drive integration
- Notification system

## Support

For issues or questions, contact: [your-contact-info]

## License

Proprietary - © 2026 Arrai Studio
