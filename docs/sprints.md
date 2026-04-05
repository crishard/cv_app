# Sprint Planning

## Sprint 1 — Foundation
**Duration:** 2 weeks  
**Goal:** Working app with auth, database, and base structure

### Functional Requirements
| ID | Requirement |
|---|---|
| RF01 | User can register with email/password |
| RF02 | User can login with email/password or Google OAuth |
| RF03 | Authenticated user sees a dashboard with their CV list |
| RF04 | User can create a new CV (title + template selection) |
| RF05 | User can delete a CV |

### Non-Functional Requirements
| ID | Requirement |
|---|---|
| RNF01 | Authentication via NextAuth with JWT sessions |
| RNF02 | All dashboard routes protected by middleware |
| RNF03 | Database schema defined and migrations applied via Prisma |
| RNF04 | Responsive base layout using Tailwind CSS |

### Deliverables
- [ ] Next.js 15 project setup with Tailwind + shadcn/ui
- [ ] Prisma schema with User, CV, Template models
- [ ] NextAuth configured (credentials + Google)
- [ ] Pages: `/login`, `/register`, `/dashboard`
- [ ] API routes: `GET /api/cv`, `POST /api/cv`, `DELETE /api/cv/[id]`

---

## Sprint 2 — Templates + Editor
**Duration:** 2 weeks  
**Goal:** User can select a template and fill out a complete CV

### Functional Requirements
| ID | Requirement |
|---|---|
| RF06 | Template gallery shows at least 3 options with visual previews |
| RF07 | User can preview a template before selecting it |
| RF08 | CV editor is structured as a 5-step wizard |
| RF09 | Steps: Personal Info → Experience → Education → Skills → Review |
| RF10 | Each step validates required fields before allowing progression |
| RF11 | CV autosaves progress every 30 seconds |
| RF12 | User can navigate back to previous steps without losing data |

### Non-Functional Requirements
| ID | Requirement |
|---|---|
| RNF05 | Templates use single-column layout (ATS-compliant) |
| RNF06 | Templates use standard system fonts only (no web fonts in export) |
| RNF07 | Autosave uses debounce to avoid excessive API calls |
| RNF08 | Form inputs include proper labels and aria attributes |

### Deliverables
- [ ] 3 CV template components: Modern, Classic, Minimal
- [ ] Step wizard component with progress indicator
- [ ] Form components for each CV section
- [ ] Live preview panel alongside the editor
- [ ] Autosave logic with debounce

---

## Sprint 3 — AI Integration
**Duration:** 2 weeks  
**Goal:** Claude AI enhances CV content and provides ATS analysis

### Functional Requirements
| ID | Requirement |
|---|---|
| RF13 | "Enhance with AI" button available on summary and experience fields |
| RF14 | AI rewrites experience descriptions using action-verb + impact format |
| RF15 | AI generates achievement bullets from free-form description input |
| RF16 | AI suggests technical skills based on job title and industry |
| RF17 | ATS Score analyzes the full CV and returns a score from 0 to 100 |
| RF18 | ATS Score includes a breakdown by section and improvement tips |
| RF19 | Keyword optimizer accepts a job description and suggests CV additions |

### Non-Functional Requirements
| ID | Requirement |
|---|---|
| RNF09 | AI responses stream to the UI (no waiting for full completion) |
| RNF10 | AI routes are rate-limited to 20 requests per minute per user |
| RNF11 | All AI prompts include a system message enforcing ATS-safe output format |
| RNF12 | UI shows a graceful fallback message on AI API errors |

### Deliverables
- [ ] `lib/anthropic.ts` with configured Claude client
- [ ] API route: `POST /api/ai/enhance` (streaming)
- [ ] API route: `POST /api/ai/generate`
- [ ] API route: `POST /api/ai/ats-score`
- [ ] `AIAssistant` panel component with streaming display
- [ ] ATS Score panel with visual score breakdown

---

## Sprint 4 — Export + Polish
**Duration:** 1 week  
**Goal:** CV ready for download and overall UX polished

### Functional Requirements
| ID | Requirement |
|---|---|
| RF20 | User can export their CV as a PDF |
| RF21 | PDF downloads directly from the preview page |
| RF22 | User can duplicate an existing CV |
| RF23 | User can share a CV via a public read-only link (optional) |

### Non-Functional Requirements
| ID | Requirement |
|---|---|
| RNF13 | PDF is generated server-side using Puppeteer for visual accuracy |
| RNF14 | PDF text is fully selectable (no image-based rendering) |
| RNF15 | PDF generation completes within 5 seconds |
| RNF16 | PDF file size stays under 500KB |

### Deliverables
- [ ] API route: `POST /api/export/pdf`
- [ ] Puppeteer configured in the Next.js server environment
- [ ] Download button on the preview page
- [ ] Duplicate CV functionality
- [ ] Final UI review and responsive fixes

---

## Timeline Summary

```
Week 1-2   Sprint 1 — Auth + Foundation
Week 3-4   Sprint 2 — Templates + Editor
Week 5-6   Sprint 3 — AI Integration
Week 7     Sprint 4 — Export + Polish
```
