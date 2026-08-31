-- Tightens RLS so each signed-in user only sees their own data. Paste into
-- Supabase SQL Editor and run once — but only AFTER 0004_multi_user_schema.sql
-- has run and every existing row has been backfilled to an owner (a
-- programme or task with user_id still null becomes invisible to everyone
-- once this runs, since none of the policies below match a null owner).

drop policy "anon full access" on programmes;
drop policy "anon full access" on contacts;
drop policy "anon full access" on interactions;
drop policy "anon full access" on documents;
drop policy "anon full access" on tasks;

create policy "owner full access" on programmes
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "owner full access" on tasks
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "owner full access" on contacts
for all
using (exists (
  select 1 from programmes p
  where p.id = contacts.programme_id and p.user_id = auth.uid()
))
with check (exists (
  select 1 from programmes p
  where p.id = contacts.programme_id and p.user_id = auth.uid()
));

create policy "owner full access" on interactions
for all
using (exists (
  select 1 from programmes p
  where p.id = interactions.programme_id and p.user_id = auth.uid()
))
with check (exists (
  select 1 from programmes p
  where p.id = interactions.programme_id and p.user_id = auth.uid()
));

create policy "owner full access" on documents
for all
using (exists (
  select 1 from programmes p
  where p.id = documents.programme_id and p.user_id = auth.uid()
))
with check (exists (
  select 1 from programmes p
  where p.id = documents.programme_id and p.user_id = auth.uid()
));

-- Storage: replace the open bucket policy from 0003_storage.sql with one
-- scoped to programme ownership. Files are uploaded under
-- `${programmeId}/${type}/...` (see uploadDocumentFile), so the first path
-- segment is always the owning programme's id — this lets us check
-- ownership without needing the documents row to exist yet, which avoids a
-- chicken/egg problem since the file is uploaded before its DB row is
-- upserted.

drop policy "anon full access to documents bucket" on storage.objects;

create policy "owner full access to documents bucket"
on storage.objects
for all
using (
  bucket_id = 'documents'
  and exists (
    select 1 from programmes p
    where p.id = (storage.foldername(name))[1]::uuid and p.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'documents'
  and exists (
    select 1 from programmes p
    where p.id = (storage.foldername(name))[1]::uuid and p.user_id = auth.uid()
  )
);
