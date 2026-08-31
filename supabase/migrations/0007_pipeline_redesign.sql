-- Pipeline redesign: drops drafting_outreach/emailed/replied (merged into
-- in_discussion) and found_advisor (merged into researching), adds a new
-- "not_open" stage, and adds an opens_on date for tracking applications
-- that aren't open yet. Paste into Supabase SQL Editor and run once.

alter table programmes add column opens_on date;

-- Merge old stages into their replacements before the allowed-values list
-- changes, so no row is ever left holding a stage value that's about to
-- become invalid.
update programmes set stage = 'in_discussion' where stage in ('drafting_outreach', 'emailed', 'replied');
update programmes set stage = 'researching' where stage = 'found_advisor';

-- Switch `stage` from a fixed Postgres enum to text + a check constraint —
-- much easier to edit next time the pipeline changes (no create-new-type/
-- copy-data/rename dance, just swap the constraint).
alter table programmes alter column stage drop default;
alter table programmes alter column stage type text using stage::text;
alter table programmes alter column stage set default 'researching';
alter table programmes add constraint programmes_stage_check
  check (stage in ('not_open', 'researching', 'in_discussion', 'preparing_application', 'submitted', 'interview', 'decision'));

drop type stage;
