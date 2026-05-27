# OVERRIDE OS — Deployment Guide

## Stack
- Next.js 14 (App Router)
- Supabase (backend + database)
- Tailwind CSS
- Vercel (deployment)

---

## Step 1 — Supabase Setup (5 minutes)

1. Go to your Supabase project: https://dzatmsxuhorycotpydrl.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it and click **RUN**
5. Verify tables `users` and `events` appear in **Table Editor**

---

## Step 2 — Deploy to Vercel (5 minutes)

### Option A — GitHub (recommended)

1. Create a new GitHub repo called `override-os`
2. Push this entire folder to it:
   ```
   git init
   git add .
   git commit -m "OVERRIDE OS initial deploy"
   git remote add origin https://github.com/YOUR_USERNAME/override-os
   git push -u origin main
   ```
3. Go to vercel.com → New Project → Import your repo
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://dzatmsxuhorycotpydrl.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (full key)
5. Click Deploy

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel
# Follow prompts
# Add env vars when asked
```

---

## Step 3 — Add PWA Icons (5 minutes)

Create two icon files and place in `/public/`:
- `icon-192.png` — 192x192px OVERRIDE logo on black background
- `icon-512.png` — 512x512px same

Use Figma, Canva, or any design tool. Black background (#060608), rocket emoji or OVERRIDE wordmark centered.

---

## Step 4 — Custom Domain (optional)

In Vercel project settings → Domains → Add `spaceshipstrains.com/mission` or a subdomain like `activate.spaceshipstrains.com`

---

## Step 5 — QR Codes

Generate 5 QR codes at qr-code-generator.com pointing to:
- `https://your-vercel-url.vercel.app/mission?planet=mars`
- `https://your-vercel-url.vercel.app/mission?planet=jupiter`
- `https://your-vercel-url.vercel.app/mission?planet=saturn`
- `https://your-vercel-url.vercel.app/mission?planet=venus`
- `https://your-vercel-url.vercel.app/mission?planet=neptune`

Download as SVG at highest resolution. Give to packaging vendor.

---

## How It Works

```
Customer buys OVERRIDE at dispensary
↓
Scans QR code on packaging
↓
Lands on /mission?planet=mars
↓
Sees cinematic entry screen (planet pre-loaded from URL)
↓
4-step activation: Name → Planet (skipped if from QR) → Intensity → Email
↓
Supabase creates user record with all data
↓
Redirects to /boarding-pass?id={supabase_user_id}
↓
Boarding pass loads LIVE data from Supabase
↓
User sees: name, planet, flight code, class, next planet recommendation
↓
User can add to home screen (PWA)
↓
GHL workflow triggers from email capture (via existing survey)
```

---

## Database Schema

### users table
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| name | text | Customer name |
| email | text | Email for notifications |
| phone | text | Optional phone |
| planet | text | Which planet they bought |
| intensity | text | less / perfect / more |
| recommendation | text | Next planet key |
| level | text | NEW_RECRUIT / CREW_MEMBER / INNER_CIRCLE / FIRST_CONTACT |
| status | text | LAUNCHED |
| scan_count | int | How many times they've scanned |
| created_at | timestamp | First scan |
| updated_at | timestamp | Last scan |

### events table
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| event_type | text | mission_started / mission_completed / etc |
| metadata | jsonb | Any additional data |
| created_at | timestamp | Event time |

---

## Level Progression

Automatic — based on scan_count:
- 1 scan → NEW_RECRUIT — Economy
- 2 scans → CREW_MEMBER — Business  
- 3 scans → INNER_CIRCLE — First Class
- 4+ scans → FIRST_CONTACT — Private Charter

localStorage `override_user_id` identifies returning users automatically.

---

## Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=https://dzatmsxuhorycotpydrl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## URLs After Deploy

| URL | Purpose |
|---|---|
| `/mission` | Generic entry (no planet pre-loaded) |
| `/mission?planet=mars` | Mars QR code destination |
| `/mission?planet=jupiter` | Jupiter QR code destination |
| `/mission?planet=saturn` | Saturn QR code destination |
| `/mission?planet=venus` | Venus QR code destination |
| `/mission?planet=neptune` | Neptune QR code destination |
| `/boarding-pass?id={uuid}` | Boarding pass (reads from Supabase) |

---

## Testing

1. Go to `/mission?planet=mars`
2. Complete the full flow
3. Check Supabase Table Editor → users → verify row was created
4. Check Supabase Table Editor → events → verify mission_completed event
5. Boarding pass should show live data from Supabase

---

OVERRIDE OS™ · SpaceShip Strains™ · Los Angeles · 2026
