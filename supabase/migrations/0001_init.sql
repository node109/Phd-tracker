-- PhD Tracker schema
-- Run this once in your Supabase project's SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

create type stage as enum (
  'researching',
  'found_advisor',
  'drafting_outreach',
  'emailed',
  'replied',
  'in_discussion',
  'preparing_application',
  'submitted',
  'interview',
  'decision'
);

create type outcome as enum ('accepted', 'rejected', 'waitlisted', 'withdrawn');
create type priority as enum ('low', 'medium', 'high');
create type contact_role as enum ('advisor', 'pi', 'coordinator', 'other');
create type interaction_type as enum ('research', 'email_sent', 'email_reply', 'call', 'meeting', 'other');
create type document_type as enum ('sop', 'research_proposal', 'cv', 'writing_sample', 'recommendation');
create type document_status as enum ('not_started', 'drafting', 'review', 'final');

create table programmes (
  id uuid primary key default gen_random_uuid(),
  university text not null,
  programme text not null,
  degree_type text,
  country text,
  deadline date,
  website text,
  priority priority not null default 'medium',
  stage stage not null default 'researching',
  outcome outcome,
  notes text,
  created_at timestamptz not null default now()
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references programmes (id) on delete cascade,
  name text not null,
  role contact_role not null default 'advisor',
  email text,
  notes text,
  created_at timestamptz not null default now()
);

create table interactions (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references programmes (id) on delete cascade,
  contact_id uuid references contacts (id) on delete set null,
  type interaction_type not null,
  note text,
  occurred_at timestamptz not null default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references programmes (id) on delete cascade,
  type document_type not null,
  status document_status not null default 'not_started',
  notes text,
  updated_at timestamptz not null default now(),
  unique (programme_id, type)
);

create index on contacts (programme_id);
create index on interactions (programme_id);
create index on interactions (occurred_at);
create index on documents (programme_id);

-- Row Level Security
-- This app has no auth in v1 (single personal user) so these policies grant
-- the anon key full read/write access to every table. That is intentional
-- for now, but it also means anyone who has your deployed URL and anon key
-- can read and edit your data. Before sharing the link, either add Supabase
-- Auth and scope these policies to auth.uid(), or put a password gate in
-- front of the app (see README "Before you share this link").

alter table programmes enable row level security;
alter table contacts enable row level security;
alter table interactions enable row level security;
alter table documents enable row level security;

create policy "anon full access" on programmes for all using (true) with check (true);
create policy "anon full access" on contacts for all using (true) with check (true);
create policy "anon full access" on interactions for all using (true) with check (true);
create policy "anon full access" on documents for all using (true) with check (true);
