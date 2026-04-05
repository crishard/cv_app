# CVForge — ATS-Optimized CV Generator with AI

> An intelligent CV builder that helps professionals create ATS-compliant resumes using AI-powered content suggestions and real-time optimization scoring.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20Prisma%20%7C%20Claude%20API-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Overview

CVForge solves a critical problem for job seekers: most resumes fail to pass Applicant Tracking Systems (ATS) before a human ever reads them. This application combines professional CV templates designed specifically for ATS compatibility with Claude AI to help users write stronger, keyword-optimized content.

**Key differentiators:**
- Templates engineered for ATS parsing (no tables, columns, or graphics in critical fields)
- AI assistant that rewrites experience bullets using action-verb + impact format
- Real-time ATS Score with actionable improvement suggestions
- Job description analyzer that aligns CV keywords to a specific role

---

## Features

| Feature | Description |
|---|---|
| Template Gallery | 3+ ATS-compliant templates (Modern, Classic, Minimal) |
| Step-by-step Editor | Guided wizard across 5 sections with autosave |
| AI Enhancement | Claude rewrites summaries and experience bullets |
| ATS Score | 0–100 score with breakdown and fix suggestions |
| Keyword Optimizer | Match CV keywords to a target job description |
| PDF Export | Server-side PDF generation with text-selectable output |
| Auth | Email/password + Google OAuth |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React + Tailwind CSS + shadcn/ui |
| ORM | Prisma |
| Database | PostgreSQL (Neon) |
| AI | Anthropic Claude API (claude-sonnet-4-5) |
| Auth | NextAuth.js v5 |
| PDF | Puppeteer (server-side) |
| Deploy | Vercel |

---

## Architecture

```
src/
├── app/
│   ├── (auth)/             # Login, Register
│   ├── (dashboard)/
│   │   ├── dashboard/      # CV list
│   │   ├── cv/
│   │   │   ├── new/        # Template selection
│   │   │   ├── [id]/edit/  # Step-by-step editor
│   │   │   └── [id]/preview/
│   │   └── templates/
│   └── api/
│       ├── auth/
│       ├── cv/             # CRUD
│       ├── ai/
│       │   ├── enhance/    # Rewrite text with AI
│       │   ├── generate/   # Generate section content
│       │   └── ats-score/  # ATS analysis
│       └── export/pdf/
├── components/
│   ├── cv-editor/
│   │   ├── steps/          # Wizard steps
│   │   ├── sections/       # CV section forms
│   │   └── ai-assistant/   # AI suggestion panel
│   ├── templates/          # Visual CV templates
│   └── ui/
├── lib/
│   ├── anthropic.ts
│   ├── prisma.ts
│   └── pdf.ts
└── types/cv.ts
```

---

## Data Model

```
User ──< CV >── Template
                 │
                 └── data: JSON (CVData)
                       ├── personalInfo
                       ├── experience[]
                       ├── education[]
                       ├── skills
                       ├── certifications[]
                       └── projects[]
```

---

## Development Roadmap

See [`docs/sprints.md`](docs/sprints.md) for the full sprint breakdown.

| Sprint | Focus | Status |
|---|---|---|
| 1 | Auth + Project foundation | In progress |
| 2 | Templates + Step editor | Planned |
| 3 | Claude AI integration | Planned |
| 4 | PDF export + Polish | Planned |

---

## Getting Started

> Full setup instructions available in [`docs/setup.md`](docs/setup.md)

```bash
git clone https://github.com/crishard/cvforge
cd cvforge
npm install
cp .env.example .env.local
npx prisma migrate dev
npm run dev
```

**Required environment variables:**

```
DATABASE_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ANTHROPIC_API_KEY=
```

---

## Functional Requirements

See [`docs/requirements.md`](docs/requirements.md) for the complete list.

**Core:**
- Users can register, login, and manage multiple CVs
- Users select a template before editing
- CV editor guides the user through 5 sections with field validation
- Content autosaves every 30 seconds

**AI:**
- Any text field can be enhanced by Claude on demand
- ATS Score analyzes the full CV and returns a 0–100 rating
- Keyword optimizer accepts a job description and suggests additions

**Export:**
- CV is exported as a PDF with selectable text (ATS-readable)
- PDF is generated server-side for visual consistency

---

## Non-Functional Requirements

- ATS templates must use single-column layout, standard fonts, no images in critical fields
- AI routes are rate-limited to 20 requests/minute per user
- AI responses stream to the UI for perceived performance
- PDF generation completes in under 5 seconds
- PDF file size under 500KB
- All routes behind `/dashboard` require authentication

---

## Author

**Crislan** — [GitHub](https://github.com/crishard)

Built as a portfolio project demonstrating full-stack development with AI integration.
