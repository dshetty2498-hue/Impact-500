-- Impact Horizon methodology v4.2 scoring catalog.
-- Run after db/schema.sql. Weights are percentages within their parent level.

insert into public.pillars (slug, name, default_weight, display_order)
values
  ('environmental', 'Environmental', 25, 1),
  ('financial-responsibility', 'Financial responsibility', 25, 2),
  ('philanthropy', 'Philanthropy', 25, 3),
  ('ethics', 'Ethics', 25, 4)
on conflict (slug) do update set
  name = excluded.name,
  default_weight = excluded.default_weight,
  display_order = excluded.display_order;

insert into public.metrics (pillar_id, code, name, description, weight, data_type, is_active)
select
  pillar.id,
  pillar.slug || '-' || rubric.code,
  rubric.name,
  rubric.description,
  20,
  'qualitative',
  true
from public.pillars as pillar
cross join (
  values
    ('commitment', 'Commitment', 'Defined policy, baseline, scope, and time-bound objective.'),
    ('governance', 'Governance', 'Assigned ownership with executive or board oversight.'),
    ('implementation', 'Implementation', 'Documented resources, controls, programs, and operating changes.'),
    ('outcome', 'Outcome', 'Comparable results reported over time against the objective.'),
    ('verification', 'Verification', 'Current, traceable, and independently assured evidence where appropriate.')
) as rubric(code, name, description)
where pillar.slug in ('environmental', 'financial-responsibility', 'philanthropy', 'ethics')
on conflict (code) do update set
  pillar_id = excluded.pillar_id,
  name = excluded.name,
  description = excluded.description,
  weight = excluded.weight,
  data_type = excluded.data_type,
  is_active = excluded.is_active;
