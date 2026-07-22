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
  fortune_rank integer check (fortune_rank between 1 and 500),
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

-- RLS baseline. The API should set request.jwt.claim.sub to the Clerk user id.
alter table public.favorites enable row level security;
create policy "members manage their own favorites" on public.favorites
  for all using (clerk_user_id = auth.jwt() ->> 'sub') with check (clerk_user_id = auth.jwt() ->> 'sub');
