# Setup Guide

## Prerequisites

- Node.js 20+
- PostgreSQL database (local or hosted — [Neon](https://neon.tech) recommended)
- Anthropic API key — [console.anthropic.com](https://console.anthropic.com)
- Google OAuth credentials (optional, for Google login)

---

## Local Development

**1. Clone and install**

```bash
git clone https://github.com/crishard/cvforge
cd cvforge
npm install
```

**2. Configure environment variables**

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cvforge"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""          # generate with: openssl rand -base64 32

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Anthropic
ANTHROPIC_API_KEY=""
```

**3. Run database migrations**

```bash
npx prisma migrate dev
npx prisma db seed          # seeds template records
```

**4. Start the dev server**

```bash
npm run dev
```

App available at `http://localhost:3000`

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | Base URL of the app |
| `NEXTAUTH_SECRET` | Yes | Secret for JWT signing |
| `GOOGLE_CLIENT_ID` | No | Enables Google OAuth login |
| `GOOGLE_CLIENT_SECRET` | No | Enables Google OAuth login |
| `ANTHROPIC_API_KEY` | Yes | Required for all AI features |

---

## Deployment (Vercel + Neon)

1. Create a PostgreSQL database at [neon.tech](https://neon.tech)
2. Import the project in [vercel.com](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy — Vercel runs `prisma migrate deploy` automatically via build command

**Recommended `package.json` build script:**
```json
"build": "prisma generate && prisma migrate deploy && next build"
```
