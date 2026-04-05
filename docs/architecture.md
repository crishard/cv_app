# Architecture

## Overview

CVForge follows a standard Next.js App Router architecture with a clear separation between UI, API, and data layers. The AI layer is isolated behind dedicated API routes to keep Claude API logic out of components.

```
Browser → Next.js App Router → API Routes → Prisma → PostgreSQL
                                          → Anthropic Claude API
                                          → Puppeteer (PDF)
```

---

## Project Structure

```
cv_app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Auth guard + sidebar
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # CV list
│   │   │   ├── cv/
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx    # Template selection
│   │   │   │   └── [id]/
│   │   │   │       ├── edit/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── preview/
│   │   │   │           └── page.tsx
│   │   │   └── templates/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/
│   │       │   └── route.ts
│   │       ├── cv/
│   │       │   ├── route.ts        # GET (list), POST (create)
│   │       │   └── [id]/
│   │       │       └── route.ts    # GET, PUT, DELETE
│   │       ├── ai/
│   │       │   ├── enhance/
│   │       │   │   └── route.ts    # Stream-enhanced text
│   │       │   ├── generate/
│   │       │   │   └── route.ts    # Generate section content
│   │       │   └── ats-score/
│   │       │       └── route.ts    # Full CV ATS analysis
│   │       └── export/
│   │           └── pdf/
│   │               └── route.ts
│   ├── components/
│   │   ├── cv-editor/
│   │   │   ├── CVEditorWizard.tsx  # Step controller
│   │   │   ├── steps/
│   │   │   │   ├── PersonalInfoStep.tsx
│   │   │   │   ├── ExperienceStep.tsx
│   │   │   │   ├── EducationStep.tsx
│   │   │   │   ├── SkillsStep.tsx
│   │   │   │   └── ReviewStep.tsx
│   │   │   ├── sections/
│   │   │   │   ├── ExperienceEntry.tsx
│   │   │   │   └── EducationEntry.tsx
│   │   │   └── ai-assistant/
│   │   │       ├── AIAssistantPanel.tsx
│   │   │       ├── ATSScorePanel.tsx
│   │   │       └── EnhanceButton.tsx
│   │   ├── templates/
│   │   │   ├── ModernTemplate.tsx
│   │   │   ├── ClassicTemplate.tsx
│   │   │   └── MinimalTemplate.tsx
│   │   └── ui/                     # shadcn/ui components
│   ├── lib/
│   │   ├── anthropic.ts            # Claude client + prompt helpers
│   │   ├── prisma.ts               # Prisma client singleton
│   │   ├── pdf.ts                  # Puppeteer PDF generation
│   │   └── auth.ts                 # NextAuth config
│   ├── types/
│   │   └── cv.ts                   # CVData, Template, User types
│   └── middleware.ts               # Route protection
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docs/
│   ├── architecture.md
│   ├── requirements.md
│   └── sprints.md
└── public/
    └── templates/                  # Template preview images
```

---

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  accounts  Account[]
  sessions  Session[]
  cvs       CV[]
  createdAt DateTime @default(now())
}

model CV {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  templateId String
  title      String
  status     CVStatus @default(DRAFT)
  atsScore   Int?
  data       Json
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Template {
  id         String  @id @default(cuid())
  name       String
  slug       String  @unique
  previewUrl String
  isPremium  Boolean @default(false)
  category   String
}

enum CVStatus {
  DRAFT
  COMPLETE
  EXPORTED
}
```

---

## CV Data Structure (JSON)

The `CV.data` field stores the complete resume content as structured JSON:

```typescript
interface CVData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin?: string
    github?: string
    portfolio?: string
    summary: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate: string | "present"
    description: string
    achievements: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa?: string
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages: Array<{ name: string; level: string }>
  }
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
    url?: string
  }>
  projects?: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    url?: string
  }>
}
```

---

## AI Integration

All AI interactions go through dedicated API routes that wrap the Anthropic SDK. Components never call Claude directly.

```
Component
  └── calls POST /api/ai/enhance
        └── validates auth + rate limit
        └── builds prompt with system message
        └── streams response from Claude
        └── returns ReadableStream to component
```

**System message strategy:** Every AI route includes a system prompt that enforces ATS-safe output — no markdown headers, no special characters, action verbs at sentence start, quantified results where possible.

---

## PDF Generation Flow

```
User clicks "Export PDF"
  → POST /api/export/pdf with CV id
  → Server fetches CV data from DB
  → Puppeteer renders the template component as HTML
  → Puppeteer prints to PDF with text-layer enabled
  → PDF buffer returned as response with Content-Disposition: attachment
```

Server-side rendering ensures the PDF matches what the user sees in the preview, and the text layer guarantees ATS parsability.

---

## Auth Flow

```
NextAuth handles:
  - Credentials provider (email + bcrypt password)
  - Google OAuth provider
  - JWT session strategy
  - Session stored in cookie

middleware.ts:
  - Matches all /dashboard/* routes
  - Redirects to /login if no valid session
```
