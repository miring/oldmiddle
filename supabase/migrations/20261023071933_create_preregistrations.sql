create table public.preregistrations (
  id uuid primary key default gen_random_uuid(),
  gender text not null check (gender in ('female','male')),
  age_group text not null,
  region_code text not null,
  phone_enc text not null,
  phone_hash text not null,
  test_type text,
  consent_version text not null,
  marketing_agreed_at timestamptz,
  cancel_token uuid not null default gen_random_uuid() unique,
  canceled_at timestamptz,
  created_at timestamptz not null default now()
);

-- 취소하지 않은 신청 안에서만 같은 번호 중복 금지
create unique index preregistrations_phone_active
  on public.preregistrations (phone_hash) where canceled_at is null;
create index preregistrations_region on public.preregistrations (region_code);

-- 잠금: RLS 켜고 정책 없음 + 권한 회수
alter table public.preregistrations enable row level security;
revoke all on table public.preregistrations from anon, authenticated;

-- 지역 신청 수만 돌려주는 함수 (취소 제외)
create or replace function public.count_region_preregistrations(p_region_code text)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::int
  from public.preregistrations
  where region_code = p_region_code and canceled_at is null;
$$;

revoke all on function public.count_region_preregistrations(text) from public;
grant execute on function public.count_region_preregistrations(text) to anon, authenticated;