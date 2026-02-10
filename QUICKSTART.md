# Arrai CRM - Quick Start Guide

## First Time Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database

You have two options:

#### Option A: Use Neon (Recommended - Free PostgreSQL)

1. Go to [https://neon.tech](https://neon.tech) and create a free account
2. Create a new project called "Arrai CRM"
3. Copy the connection string
4. Create `.env` file in the project root with:

```env
DATABASE_URL="your-neon-connection-string-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run-npx-auth-secret-to-generate-this"
```

5. Generate auth secret:
```bash
npx auth secret
```

Copy the generated secret and add it to your `.env` file.

#### Option B: Use Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database named `arrai_crm`
3. Create `.env` file:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/arrai_crm"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run-npx-auth-secret-to-generate-this"
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Seed database with demo data
npx tsx prisma/seed.ts
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Login Credentials

After seeding, you can login with:

- **Admin**: `admin@arrai.com` / `admin123`
- **Team Member**: `team@arrai.com` / `team123`
- **Client User**: `client@idk.com` / `client123`

## What's Included

The seed data creates:
- 3 users (Admin, Team Member, Client)
- 1 demo client (IDK Kitchen)
- 1 demo project
- 2 demo services (Branding - completed, Website - in progress)
- Completed onboarding checklist

## Common Commands

```bash
# Development
npm run dev                  # Start dev server

# Database
npx prisma studio           # Open database GUI
npx prisma migrate dev      # Create new migration
npx prisma generate         # Regenerate Prisma Client

# Build
npm run build               # Build for production
npm start                   # Run production build
```

## Troubleshooting

### Database connection errors
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running (if local)
- Test connection with `npx prisma studio`

### "Module not found" errors
- Run `npm install` again
- Clear `.next` folder: `rm -rf .next` (or delete manually)
- Restart dev server

### Auth errors
- Ensure `NEXTAUTH_SECRET` is set in `.env`
- Clear browser cookies and try again

## Next Steps

1. Explore the dashboard
2. Create a new client
3. Add projects and services
4. Test different user roles
5. Start customizing for your needs!

## Need Help?

- Check the main [README.md](./README.md) for full documentation
- Review the [Implementation Plan](../brain/.../implementation_plan.md)
- Contact: [your-contact-info]
