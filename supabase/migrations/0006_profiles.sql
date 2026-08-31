-- Per-user profile data: right now just a unique forwarding-email token,
-- used to build each account's own "forward admissions emails here" address
-- (e.g. phdtracker+<token>@corporatedropout.in). Paste into Supabase SQL
-- Editor and run once.

create table profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  forwarding_token text not null unique default encode(gen_random_bytes(6), 'hex'),
  welcome_email_sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "owner full access" on profiles
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());
