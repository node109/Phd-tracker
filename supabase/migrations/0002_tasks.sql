-- Adds a general-purpose tasks/notes table for anything that doesn't tie to
-- one specific programme (reading list, generic to-dos, unattached
-- recommenders, etc). Paste into Supabase SQL Editor and run once.

create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  done boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

alter table tasks enable row level security;
create policy "anon full access" on tasks for all using (true) with check (true);
