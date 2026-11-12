-- 사전 신청 연락처를 휴대폰 번호에서 이메일로 바꿉니다 (2026-11-10 결정: 카카오 채널·문자를 쓰지 않음).
-- 신청 → 확인 메일의 링크를 누르면 confirmed_at이 채워지고, 그때부터 신청자 수·통계에 들어갑니다.
--
-- 지금까지 저장된 행은 개발 DB의 시험 신청뿐입니다(운영은 문자 인증 전이라 sms_not_ready로 저장된 적 없음).
-- 휴대폰 번호 칸을 지우므로 시험 행도 함께 지웁니다.
delete from public.preregistrations;
delete from public.preregister_attempts;

drop index if exists public.preregistrations_phone_active;
alter table public.preregistrations
  drop column phone_enc,
  drop column phone_hash,
  add column email_enc text not null,                -- AES-GCM 암호문 (발송할 때만 되돌림)
  add column email_hash text not null,               -- 중복 확인·횟수 제한용 HMAC
  add column confirm_token uuid not null default gen_random_uuid() unique,
  add column confirm_sent_at timestamptz not null default now(),
  add column confirmed_at timestamptz;

-- 취소하지 않은 신청 안에서만 같은 메일 중복 금지
create unique index preregistrations_email_active
  on public.preregistrations (email_hash) where canceled_at is null;

-- 지역 신청 수: 메일 확인을 마친 신청만
create or replace function public.count_region_preregistrations(p_region_code text)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::int
  from public.preregistrations
  where region_code = p_region_code and canceled_at is null and confirmed_at is not null;
$$;

-- 통계도 확인을 마친 신청만 (daily_stats는 확인 수를 맨 끝 칸에 더함)
create or replace view admin.region_stats as
select region_code,
       count(*) filter (where gender = 'female') as female,
       count(*) filter (where gender = 'male') as male,
       count(*) as total
from public.preregistrations
where canceled_at is null and confirmed_at is not null
group by region_code
order by total desc;

create or replace view admin.gender_age_stats as
select gender, age_group, count(*) as total
from public.preregistrations
where canceled_at is null and confirmed_at is not null
group by gender, age_group
order by gender, age_group;

create or replace view admin.daily_stats as
select (created_at at time zone 'Asia/Seoul')::date as day,
       count(*) as signed_up,
       count(canceled_at) as canceled,
       count(marketing_agreed_at) as marketing_agreed,
       count(confirmed_at) as confirmed
from public.preregistrations
group by 1
order by 1 desc;

-- 자동 파기: 기존 기준 + 확인 메일을 보낸 지 2일이 지나도록 확인하지 않은 신청
create or replace function admin.purge_expired_preregistrations()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  open_at timestamptz;
  deleted integer;
begin
  select official_open_at into open_at from admin.settings;

  delete from public.preregistrations
  where created_at < now() - interval '1 year'
     or (open_at is not null and now() >= open_at + interval '6 months')
     or (confirmed_at is null and confirm_sent_at < now() - interval '2 days');

  get diagnostics deleted = row_count;
  return deleted;
end;
$$;
