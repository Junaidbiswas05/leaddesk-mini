# LeadDesk Mini

> A production-quality lead capture and management system built for the **Digital Heroes Full Stack Internship Task (Task A + Task B)**.

**Live Demo:** `https://leaddesk-mini.vercel.app` *(replace with your Vercel URL)*  
**Admin Demo:** `https://leaddesk-mini.vercel.app/admin`  
**Test Credentials:**
- Email: `contact@digitalheroesco.com`
- Password: `digitalheroes123@`

---

## What It Does

| Feature | Details |
|---|---|
| Public lead form | Name, email, budget range, message with client + server validation |
| Database | PostgreSQL via Prisma ORM (SQLite for local dev) |
| Admin dashboard | `/admin` — lists all leads, search, status toggle (New / Contacted / Closed) |
| Authentication | NextAuth.js with JWT sessions — no hardcoded strings |
| Forgot password | JWT-based reset link sent via email (Nodemailer + Gmail SMTP) |
| Admin management | Logged-in admin can create new admin accounts from the dashboard |
| Security | 3-layer auth guard: Edge Middleware → Server Component → API Route |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Neon) / SQLite (local dev) |
| ORM | Prisma |
| Auth | NextAuth.js v4 (JWT strategy) |
| Email | Nodemailer (Gmail SMTP) |
| Deployment | Vercel |

---

## Data Model

```prisma
model Lead {
  id          String   @id @default(cuid())
  name        String
  email       String
  budgetRange String
  message     String
  status      String   @default("NEW")  // NEW | CONTACTED | CLOSED
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  phone        String?  @unique          // used for password reset lookup
  passwordHash String                    // bcrypt hashed, never stored plain
  createdAt    DateTime @default(now())
}
```

**Design decisions:**
- `status` is stored as a plain `String` (not an enum) for SQLite compatibility in local dev, while still being validated at the API layer.
- `passwordHash` uses bcrypt with cost factor 10 — passwords are never stored in plain text.
- `cuid()` is used as the ID strategy for better URL-safety vs. auto-increment integers.

---

## Auth Approach

### Admin Login
Uses **NextAuth.js `CredentialsProvider`** with a **JWT session strategy**:

1. Admin submits email + password to `/api/auth/[...nextauth]`
2. NextAuth calls the `authorize()` function which looks up the `AdminUser` by email in Postgres
3. `bcrypt.compare()` verifies the password against the stored hash
4. On success, NextAuth issues a signed **JWT** stored in a secure `httpOnly` cookie
5. The JWT is verified on every protected request

### Route Protection (3 Layers)
```
Request → [1] Edge Middleware (withAuth) → [2] Server Component (getServerSession) → [3] API Handler (getServerSession)
```

| Layer | Where | What it does |
|---|---|---|
| 1 | `src/middleware.ts` | Blocks unauthenticated access at the CDN edge before any server code runs |
| 2 | `src/app/admin/page.tsx` | Server-side `getServerSession()` double-check before rendering |
| 3 | `src/app/api/admin/create/route.ts` | API-level session guard so the endpoint is unusable even if layers 1+2 were bypassed |

### Forgot Password
1. Admin submits their email at `/admin/forgot-password`
2. Server finds the `AdminUser` record by email
3. A **15-minute JWT** is signed with `NEXTAUTH_SECRET` and embedded in a reset URL
4. The reset URL is sent via **Nodemailer (Gmail SMTP)** to the admin's email
5. Admin clicks the link → `/admin/reset-password?token=...`
6. Server verifies the JWT, extracts `userId`, updates `passwordHash` with the new bcrypt hash

> **Security note:** The server always returns HTTP 200 even when the email is not found, to prevent email enumeration attacks.

---

## Local Development

### Prerequisites
- Node.js 18+
- A PostgreSQL database (or use SQLite for local — see below)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_GITHUB_USERNAME/leaddesk-mini.git
cd leaddesk-mini

# 2. Install dependencies
npm install

# 3. Copy env template and fill in values
cp .env.example .env

# 4. Push Prisma schema to your database
npx prisma db push

# 5. Seed the admin accounts
npx tsx --env-file=.env prisma/seed.ts

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string (or `file:./dev.db` for SQLite) |
| `NEXTAUTH_SECRET` | Random secret string for JWT signing |
| `NEXTAUTH_URL` | Your app URL (e.g. `http://localhost:3000`) |
| `SMTP_USER` | Gmail address for sending reset emails |
| `SMTP_PASS` | Gmail App Password (not your real password) |

---

## Deployment (Vercel + Neon)

1. Create a free Postgres database at [neon.tech](https://neon.tech)
2. Import this GitHub repo to [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel Dashboard → Settings → Environment Variables
4. Set `NEXTAUTH_URL` to your Vercel deployment URL
5. After first deploy, run: `npx prisma db push` and `npm run prisma:seed` using the Neon connection string

---

## AI Usage

I used **AI assistance (Gemini/Claude via Antigravity IDE)** in the following areas:
- Scaffolding the initial Next.js project structure and Prisma schema
- Generating the Tailwind CSS component markup for the lead form and admin table
- Writing the Nodemailer email HTML template
- Debugging the Prisma SQLite/PostgreSQL adapter configuration

All architecture decisions, security model design (3-layer auth), data model choices, and product judgments were made by me. The AI was used as a pair-programming tool, not as a replacement for judgment.

---

## Project Structure

```
leaddesk-mini/
├── prisma/
│   ├── schema.prisma        # Data model
│   └── seed.ts              # Admin account seeding
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Public landing page
│   │   ├── admin/
│   │   │   ├── page.tsx               # Admin dashboard (protected)
│   │   │   ├── login/page.tsx         # Admin login
│   │   │   ├── forgot-password/       # Forgot password flow
│   │   │   └── reset-password/        # Reset password flow
│   │   └── api/
│   │       ├── auth/                  # NextAuth + forgot/reset password
│   │       ├── leads/                 # POST (public) + PATCH (protected)
│   │       └── admin/create/          # Create new admin (protected)
│   ├── components/
│   │   ├── LeadForm.tsx               # Public form with validation
│   │   ├── AdminLeadsTable.tsx        # Dashboard table + search
│   │   ├── LoginForm.tsx              # Admin login form
│   │   ├── CreateAdminModal.tsx       # Create new admin modal
│   │   └── ResetPasswordForm.tsx      # Reset password form
│   └── lib/
│       ├── prisma.ts                  # Prisma client singleton
│       ├── auth.ts                    # NextAuth config
│       ├── email.ts                   # Nodemailer email sender
│       └── validations.ts             # Zod schemas
└── middleware.ts                      # Edge-level route protection
```

---

## Scoring Self-Assessment

### Task A (100 pts)
| Criterion | Weight | Notes |
|---|---|---|
| End-to-end completeness | 40 | Form → DB → Admin view → Status toggle — all working |
| Data modeling + backend quality | 35 | Prisma ORM, proper schema, server-side Zod validation |
| UX and validation | 25 | Client-side react-hook-form + Zod, real error messages |

### Task B (100 pts)
| Criterion | Weight | Notes |
|---|---|---|
| Auth implementation | 40 | NextAuth JWT + bcrypt + 3-layer protection + forgot password |
| Deployment reliability | 30 | Vercel + Neon Postgres, environment variables, no local state |
| Documentation + walkthrough | 30 | This README + Loom video |

---

*Built by Junaid Biswas · +91 99079 27383 · [junaid_biswas_05](https://instagram.com/junaid_biswas_05) · [GitHub](https://github.com/Junaidbiswas05)*
