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
   uploads, `0004_multi_user_schema.sql` and `0005_scope_rls_to_owner.sql`
   add per-user data isolation — see **Authentication** below for how to
   sequence those two safely if you're upgrading an existing deployment —
   and `0006_profiles.sql` adds each account's forwarding-email token (see
   **Email** below).
3. In **Project Settings → API**, copy the **Project URL** and **anon public**
   key into `.env.local` (locally) and into your Vercel project's environment
   variables (for deployment):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

## Authentication

The app is genuinely multi-user: anyone signs in with Google, and Postgres
Row Level Security scopes every query to `auth.uid()`, so each account only
ever sees its own programmes, contacts, interactions, documents, and tasks.
There's no separate password or invite system to manage — Google handles
identity, Supabase issues the session, and RLS does the data isolation.

### One-time setup

1. **Google Cloud Console** → create an OAuth 2.0 Client ID (Application
   type: **Web application**). Add this as an authorized redirect URI:
   ```
   https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
   ```
   Publish the OAuth consent screen (Testing mode caps sign-in to a
   manually-approved list of testers, which defeats "anyone can sign in").
   Only basic scopes (openid/email/profile) are requested, so publishing
   doesn't require Google review.
2. **Supabase dashboard** → Authentication → Providers → **Google** → paste
   the Client ID and Client Secret from step 1, enable the provider.

## Email

Each account gets a unique forwarding address (`phdtracker+<token>@corporatedropout.in`,
shown on the **Settings** page) that's meant for forwarding admissions
emails to be logged automatically — the address itself is provisioned
already, but the automatic parsing side isn't wired up yet, so forwarding
to it currently does nothing.

Welcome emails (sent on first sign-in, introducing the forwarding address)
go through [Resend](https://resend.com):

1. Sign up at resend.com and grab an API key.
2. Add it as `RESEND_API_KEY` in `.env.local` and in Vercel's environment
   variables.

Without this key set, sign-in still works fine — the welcome email is
just silently skipped.

### Rolling this out on an existing deployment (zero downtime)

If you already have data in the old open-access schema, run these in order
so nothing disappears mid-rollout:

1. Do the Google Cloud + Supabase setup above — this has no effect on the
   live site yet.
2. Deploy this code. The *old* permissive policies from `0001`/`0002` are
   still active at this point, so your first Google login immediately shows
   your existing data — this just confirms the whole login flow works
   before anything gets stricter.
3. Run `0004_multi_user_schema.sql`, then backfill your existing rows to
   your account (replace the email with the Google account you signed in
   with):
   ```sql
   update programmes set user_id = (select id from auth.users where email = 'you@example.com') where user_id is null;
   update tasks set user_id = (select id from auth.users where email = 'you@example.com') where user_id is null;
   ```
4. Run `0005_scope_rls_to_owner.sql`. Your data is already owned by your
   account by this point, so nothing is lost — from here on, every other
   Google account that signs in gets its own empty, fully isolated tracker.

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
- Supabase (Postgres + Auth) via `@supabase/ssr`, read in Server Components
  and written via Server Actions — no separate API layer. Google sign-in
  issues a session cookie; middleware refreshes it on every request and
  Row Level Security enforces per-user data isolation
- Hand-built shadcn/ui-style components on top of Radix UI primitives (the
  shadcn CLI's own registry wasn't reachable from the build environment this
  was built in, so the components were written directly instead of generated
  — functionally the same, and you can still pull further components from
  [ui.shadcn.com](https://ui.shadcn.com) yourself the normal way)
- Recharts for the stage-distribution chart
