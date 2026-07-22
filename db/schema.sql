-- Impact500 PostgreSQL / Supabase schema
-- UUIDs use gen_random_uuid() from pgcrypto (available in Supabase).

create type public.app_role as enum ('member', 'researcher', 'admin');
create type public.article_type as enum ('article', 'industry_report', 'trend_analysis', 'publication');
create type public.source_type as enum ('filing', 'report', 'news', 'nonprofit', 'government', 'company');

create table public.industries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  industry_id uuid references public.industries(id) on delete set null,
  name text not null,
  slug text not null unique,
  ticker text,
  founded_year smallint,
  employee_count bigint check (employee_count >= 0),
  annual_revenue_usd numeric(18,2) check (annual_revenue_usd >= 0),
  fortune_rank integer check (fortune_rank between 1 and 500),
  fortune_rank_year smallint check (fortune_rank_year between 1955 and 2100),
  headquarters_city text,
  headquarters_region text,
  website_url text,
  logo_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name)
);
create index companies_industry_idx on public.companies(industry_id);
create index companies_published_idx on public.companies(is_published, fortune_rank);

create table public.company_profiles (
  company_id uuid primary key references public.companies(id) on delete cascade,
  overview text,
  research_notes text[] not null default '{}',
  last_reviewed_on date,
  strengths text[] not null default '{}',
  weaknesses text[] not null default '{}',
  controversies jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.score_periods (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  published_at timestamptz,
  is_current boolean not null default false,
  check (label ~ '^[0-9]{4}(-[0-9]{2})?$')
);
create unique index one_current_score_period on public.score_periods (is_current) where is_current;

create table public.pillars (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  default_weight numeric(5,2) not null check (default_weight >= 0 and default_weight <= 100),
  display_order smallint not null unique
);

create table public.metrics (
  id uuid primary key default gen_random_uuid(),
  pillar_id uuid not null references public.pillars(id) on delete restrict,
  code text not null unique,
  name text not null,
  description text,
  weight numeric(5,2) not null check (weight >= 0 and weight <= 100),
  data_type text not null default 'numeric' check (data_type in ('numeric', 'boolean', 'qualitative')),
  is_active boolean not null default true
);

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  period_id uuid not null references public.score_periods(id) on delete restrict,
  pillar_id uuid references public.pillars(id) on delete restrict,
  score numeric(5,2) not null check (score >= 0 and score <= 100),
  letter_grade text generated always as (case when score >= 90 then 'A+' when score >= 85 then 'A' when score >= 80 then 'A-' when score >= 75 then 'B+' when score >= 70 then 'B' else 'C' end) stored,
  methodology_version text not null,
  published_at timestamptz,
  unique(company_id, period_id, pillar_id)
);
create index scores_leaderboard_idx on public.scores(period_id, pillar_id, score desc);

create table public.metric_observations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  metric_id uuid not null references public.metrics(id) on delete cascade,
  period_id uuid not null references public.score_periods(id) on delete restrict,
  numeric_value numeric,
  text_value text,
  normalized_score numeric(5,2) check (normalized_score between 0 and 100),
  confidence smallint check (confidence between 1 and 5),
  reviewed_at timestamptz not null default now(),
  unique(company_id, metric_id, period_id)
);

create table public.research_sources (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  title text not null,
  source_url text not null,
  source_type public.source_type not null,
  publisher text,
  published_on date,
  accessed_on date not null default current_date,
  citation text,
  created_at timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  author_id text, -- Clerk user id
  type public.article_type not null default 'article',
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb not null default '[]'::jsonb,
  cover_image_url text,
  published_at timestamptz,
  read_time_minutes smallint,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.annual_reports (
  id uuid primary key default gen_random_uuid(),
  year smallint not null unique check (year >= 2020),
  title text not null,
  slug text not null unique,
  edition text,
  citation text,
  executive_summary text,
  pdf_url text not null,
  cover_image_url text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  headline text not null,
  url text not null,
  publisher text,
  published_at timestamptz,
  sentiment smallint check (sentiment between -2 and 2),
  created_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  slug text not null unique,
  research_focus text,
  contributions text,
  bio text,
  image_url text,
  display_order smallint not null default 0,
  is_active boolean not null default true
);

create table public.users (
  clerk_user_id text primary key,
  email text,
  display_name text,
  role public.app_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.favorites (
  clerk_user_id text not null references public.users(clerk_user_id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (clerk_user_id, company_id)
);

create type public.saved_item_type as enum ('company', 'research', 'report', 'industry');
create type public.activity_type as enum ('view', 'read', 'download', 'comparison');

create table public.saved_items (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null references public.users(clerk_user_id) on delete cascade,
  item_type public.saved_item_type not null,
  item_slug text not null,
  title text not null,
  href text not null,
  created_at timestamptz not null default now(),
  unique (clerk_user_id, item_type, item_slug)
);

create table public.watchlists (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null references public.users(clerk_user_id) on delete cascade,
  name text not null check (char_length(name) between 1 and 50),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.watchlist_companies (
  watchlist_id uuid not null references public.watchlists(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (watchlist_id, company_id)
);

create table public.member_activity (
  id bigint generated always as identity primary key,
  clerk_user_id text not null references public.users(clerk_user_id) on delete cascade,
  activity_type public.activity_type not null,
  item_slug text not null,
  title text not null,
  href text not null,
  occurred_at timestamptz not null default now()
);
create index member_activity_user_time_idx on public.member_activity(clerk_user_id, occurred_at desc);

create table public.notification_preferences (
  clerk_user_id text primary key references public.users(clerk_user_id) on delete cascade,
  new_research boolean not null default true,
  annual_reports boolean not null default true,
  score_updates boolean not null default false,
  product_updates boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.saved_comparisons (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null references public.users(clerk_user_id) on delete cascade,
  name text not null,
  company_slugs text[] not null check (cardinality(company_slugs) between 2 and 6),
  created_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table public.article_tags (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

create table public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  publication_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  asset_url text,
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_audit_log (
  id bigint generated always as identity primary key,
  actor_id text references public.users(clerk_user_id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) between 3 and 254),
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  subscribed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;

-- RLS baseline. The API should set request.jwt.claim.sub to the Clerk user id.
alter table public.favorites enable row level security;
create policy "members manage their own favorites" on public.favorites
  for all using (clerk_user_id = auth.jwt() ->> 'sub') with check (clerk_user_id = auth.jwt() ->> 'sub');

alter table public.saved_items enable row level security;
alter table public.watchlists enable row level security;
alter table public.watchlist_companies enable row level security;
alter table public.member_activity enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.saved_comparisons enable row level security;

create policy "members manage saved items" on public.saved_items for all using (clerk_user_id = auth.jwt() ->> 'sub') with check (clerk_user_id = auth.jwt() ->> 'sub');
create policy "members manage watchlists" on public.watchlists for all using (clerk_user_id = auth.jwt() ->> 'sub') with check (clerk_user_id = auth.jwt() ->> 'sub');
create policy "members manage watchlist companies" on public.watchlist_companies for all using (exists (select 1 from public.watchlists where id = watchlist_id and clerk_user_id = auth.jwt() ->> 'sub')) with check (exists (select 1 from public.watchlists where id = watchlist_id and clerk_user_id = auth.jwt() ->> 'sub'));
create policy "members manage activity" on public.member_activity for all using (clerk_user_id = auth.jwt() ->> 'sub') with check (clerk_user_id = auth.jwt() ->> 'sub');
create policy "members manage notifications" on public.notification_preferences for all using (clerk_user_id = auth.jwt() ->> 'sub') with check (clerk_user_id = auth.jwt() ->> 'sub');
create policy "members manage comparisons" on public.saved_comparisons for all using (clerk_user_id = auth.jwt() ->> 'sub') with check (clerk_user_id = auth.jwt() ->> 'sub');
