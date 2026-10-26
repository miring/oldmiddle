-- 사전 신청 정보 자동 파기 (동의서 기준)
-- "정식 오픈 후 6개월 또는 신청일로부터 1년 중 먼저 오는 날"이 지나면 지웁니다.
-- 정식 오픈일이 정해지면 SQL Editor에서:
--   update admin.settings set official_open_at = '2027-03-01 00:00+09';
create extension if not exists pg_cron with schema pg_catalog;

create table admin.settings (
  id boolean primary key default true check (id), -- 한 줄만 두는 설정 표
  official_open_at timestamptz                    -- 정식 오픈일 (정해지기 전에는 비움)
);
insert into admin.settings default values;
revoke all on table admin.settings from public, anon, authenticated;

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
     or (open_at is not null and now() >= open_at + interval '6 months');

  get diagnostics deleted = row_count;
  return deleted;
end;
$$;

revoke all on function admin.purge_expired_preregistrations() from public, anon, authenticated;

-- 매일 새벽 3시(한국 시간) = 18:00 UTC. 같은 이름으로 다시 실행하면 일정만 바뀝니다.
select cron.schedule(
  'purge-expired-preregistrations',
  '0 18 * * *',
  'select admin.purge_expired_preregistrations()'
);
