# Requirements

## Functional Requirements

### Authentication
| ID | Requirement | Priority |
|---|---|---|
| RF01 | User can register with email and password | High |
| RF02 | User can login with email/password or Google OAuth | High |
| RF03 | User session persists across page refreshes | High |
| RF04 | All dashboard pages redirect unauthenticated users to login | High |

### CV Management
| ID | Requirement | Priority |
|---|---|---|
| RF05 | User can create multiple CVs | High |
| RF06 | User can delete a CV | High |
| RF07 | User can duplicate an existing CV | Medium |
| RF08 | CV draft status is shown on the dashboard | Medium |
| RF09 | CV autosaves every 30 seconds during editing | High |

### Template Selection
| ID | Requirement | Priority |
|---|---|---|
| RF10 | Gallery shows at least 3 templates with visual previews | High |
| RF11 | User selects a template before entering the editor | High |
| RF12 | Template can be changed before the CV is exported | Low |

### CV Editor
| ID | Requirement | Priority |
|---|---|---|
| RF13 | Editor is structured as a 5-step wizard | High |
| RF14 | Step 1 — Personal Info: name, email, phone, location, LinkedIn, summary | High |
| RF15 | Step 2 — Experience: company, role, dates, description, achievements | High |
| RF16 | Step 3 — Education: institution, degree, field, dates | High |
| RF17 | Step 4 — Skills: technical skills, soft skills, languages | High |
| RF18 | Step 5 — Review: full preview before export | High |
| RF19 | Required fields are validated before moving to the next step | High |
| RF20 | User can add multiple entries to Experience, Education, and Skills | High |
| RF21 | User can reorder experience and education entries | Low |

### AI Features
| ID | Requirement | Priority |
|---|---|---|
| RF22 | "Enhance with AI" available on summary and experience fields | High |
| RF23 | AI rewrites content using action-verb + quantified impact format | High |
| RF24 | AI generates achievement bullets from a free-form description | High |
| RF25 | AI suggests relevant skills based on job title | Medium |
| RF26 | ATS Score: full CV is analyzed and returns a score from 0–100 | High |
| RF27 | ATS Score includes per-section breakdown and fix suggestions | High |
| RF28 | Keyword optimizer: user pastes a job description, AI suggests additions | Medium |

### Export
| ID | Requirement | Priority |
|---|---|---|
| RF29 | User can export CV as a downloadable PDF | High |
| RF30 | PDF matches the selected template visually | High |
| RF31 | User can share CV via a public read-only link | Low |

---

## Non-Functional Requirements

### Security
| ID | Requirement |
|---|---|
| RNF01 | Authentication handled by NextAuth with secure JWT sessions |
| RNF02 | API routes validate user ownership before returning or modifying CVs |
| RNF03 | AI routes are rate-limited to 20 requests per minute per user |
| RNF04 | Environment variables used for all secrets (API keys, DB URLs) |

### ATS Compliance
| ID | Requirement |
|---|---|
| RNF05 | Templates use single-column layout only |
| RNF06 | Templates avoid tables, text boxes, and multi-column sections |
| RNF07 | Templates use standard fonts (Arial, Calibri, Times New Roman) |
| RNF08 | PDF output uses selectable text, not rasterized images |
| RNF09 | Section headings use consistent, recognizable labels (Experience, Education, Skills) |

### Performance
| ID | Requirement |
|---|---|
| RNF10 | PDF generation completes in under 5 seconds |
| RNF11 | PDF file size is under 500KB |
| RNF12 | AI responses stream to the UI to avoid blocking the interface |
| RNF13 | Autosave uses debounce to avoid unnecessary API calls |

### Usability
| ID | Requirement |
|---|---|
| RNF14 | Application is fully responsive (mobile, tablet, desktop) |
| RNF15 | Form inputs include proper labels and ARIA attributes |
| RNF16 | AI errors display a clear, user-friendly fallback message |
| RNF17 | Editor shows a live preview of the CV as the user types |

### Maintainability
| ID | Requirement |
|---|---|
| RNF18 | CV data stored as structured JSON in the database |
| RNF19 | AI prompts centralized in a single file for easy updates |
| RNF20 | Each template is an isolated React component |
