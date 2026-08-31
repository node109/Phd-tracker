-- Adds per-user ownership to the tables that don't already inherit it via a
-- foreign key (programmes, tasks). Paste into Supabase SQL Editor and run
-- once. This does NOT change any access policies yet — 0001/0002's "anon
-- full access" policies stay active until 0005_scope_rls_to_owner.sql runs,
-- so existing logins keep working through this step.
--
-- Added nullable first, then defaulted, as two separate steps on purpose:
-- combining `not null` + `default auth.uid()` in one `add column` against a
-- table that already has rows fails immediately, since auth.uid() evaluates
-- to NULL when this runs from the SQL Editor (no request JWT in that
-- session). Existing rows get backfilled to your account separately — see
-- the backfill snippet you were given alongside this migration.

alter table programmes add column user_id uuid references auth.users (id);
alter table tasks add column user_id uuid references auth.users (id);

alter table programmes alter column user_id set default auth.uid();
alter table tasks alter column user_id set default auth.uid();

create index on programmes (user_id);
create index on tasks (user_id);
