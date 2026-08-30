# PhD Tracker

An interactive dashboard for tracking your PhD applications end to end —
finding programmes, finding advisors, outreach, ongoing discussion, applying,
and writing your statements/proposals. Built with Next.js and Supabase, meant
to be deployed to Vercel.

This replaces the earlier CLI version of this project.

## What it does

- **Dashboard** (`/`) — points/level/streak/badges earned from your real
  activity, stat tiles, an upcoming-deadlines list (anything due within 14
  days), and a chart of how many programmes are in each pipeline stage.
- **Board** (`/board`) — a Kanban view of every programme, one column per
  stage. Move a card by dragging it or via its dropdown, search/filter by
  university, programme, country, or priority, select multiple cards for
  bulk move/re-prioritize/delete, and use the "Mark emailed"/"Mark replied"
  button for one-click logging without opening the programme.
- **Add Programme** (`/programmes/new`) — log a new university/programme,
  its deadline, and (optionally) your first contact there. Supports being
  prefilled by the bookmarklet below.
- **Programme detail** (`/programmes/[id]`) — edit the programme, manage its
  contacts, log an interaction timeline (research notes, emails sent/replied,
  calls, meetings), track its outcome once a decision comes in, and check off
  and upload files for its documents (SOP, research proposal, CV, writing
  sample, recommendation).
- **Documents** (`/documents`) — every document across every programme,
  grouped by status, so you can see at a glance what still needs writing.
- **Tasks** (`/tasks`) — a general to-do/notes list for anything that isn't
  tied to one specific programme (reading list, generic action items,
  recommenders you haven't matched to an application yet).
- **Export** — a button on the dashboard downloads your entire dataset as
  JSON (`/api/export`), as a personal backup.

### Gamification

Points, your streak, and badges are all **computed from what you actually
log** (interactions, stages reached, documents drafted) — there's no separate
score to fake or keep in sync. It's a way of making the process feel less like
a black hole while you wait for replies.

## Pipeline stages

`Researching → Found Advisor → Drafting Outreach → Emailed → Replied →
In Discussion → Preparing Application → Submitted → Interview → Decision`

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project's URL + anon key
npm run dev
```

## Setting up the database (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor** and run each file in
   `supabase/migrations/` **in order** (paste the contents, click Run, move
   to the next file): `0001_init.sql` creates the core tables, `0002_tasks.sql`
   adds the Tasks page's table, `0003_storage.sql` adds document file
   uploads.
3. In **Project Settings → API**, copy the **Project URL** and **anon public**
   key into `.env.local` (locally) and into your Vercel project's environment
   variables (for deployment):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

### Before you share this link

There's no login in v1 — it's built for one person (you) tracking your own
applications, so keeping it simple mattered more than multi-user auth. That
means **anyone with your deployed URL and anon key can read and edit your
data**, including advisor contact details and SOP notes. That's fine as long
as you don't share the link. If you do want to share it later, either:

- add [Supabase Auth](https://supabase.com/docs/guides/auth) and scope the
  Row Level Security policies in the migration to `auth.uid()`, or
- put a simple password gate in front of the app (e.g. Next.js middleware
  checking a cookie against a secret environment variable).

## Deploying to Vercel

1. Push this repo to GitHub (already done if you're reading this on the
   `claude/uni-applications-tracker-0bvnsn` branch).
2. In [vercel.com](https://vercel.com), import the repo as a new project —
   Vercel auto-detects Next.js, no build configuration needed.
3. Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables from the step
   above in the Vercel project settings.
4. Deploy. Every push to this branch will redeploy automatically once the
   Vercel project is connected.

## Quick-add bookmarklet

Drag this link to your bookmarks bar (or bookmark this page and edit the
URL afterward) to add whatever programme page you're currently browsing
with one click — it opens a small popup pre-filled with the page's title
and URL, which you can review and edit before saving:

```
javascript:(function(){var u=encodeURIComponent(location.href);var t=encodeURIComponent(document.title);window.open('https://phdtracker.corporatedropout.in/programmes/new?url='+u+'&title='+t,'phdtracker','width=480,height=760');})();
```

This works in Safari, Chrome, or any browser — no extension or app-store
packaging needed. Nothing is saved until you review the popup and click
"Add programme."

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres) via `@supabase/supabase-js`, read in Server Components
  and written via Server Actions — no separate API layer
- Hand-built shadcn/ui-style components on top of Radix UI primitives (the
  shadcn CLI's own registry wasn't reachable from the build environment this
  was built in, so the components were written directly instead of generated
  — functionally the same, and you can still pull further components from
  [ui.shadcn.com](https://ui.shadcn.com) yourself the normal way)
- Recharts for the stage-distribution chart
