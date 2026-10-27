-- 사전 신청 횟수 제한
-- 같은 번호·같은 IP에서 짧은 시간에 반복 요청하는 것을 막습니다 (인증번호 맞히기, 문자 비용 남용 방지).
-- 번호와 IP는 원문이 아니라 HMAC 해시로만 기록하고, 하루가 지나면 지웁니다.
create table public.preregister_attempts (
  id bigint generated always as identity primary key,
  key text not null,              -- 'phone:<해시>' 또는 'ip:<해시>'
  created_at timestamptz not null default now()
);
create index preregister_attempts_key_time on public.preregister_attempts (key, created_at);

alter table public.preregister_attempts enable row level security;
revoke all on table public.preregister_attempts from anon, authenticated;
grant select, insert, delete on table public.preregister_attempts to service_role;

-- 요청을 한 번 기록하고, 창(p_window) 안의 횟수가 p_max를 넘으면 true(막음)를 돌려줍니다.
create or replace function public.hit_preregister_rate_limit(p_key text, p_window_seconds integer, p_max integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  hits integer;
begin
  insert into public.preregister_attempts (key) values (p_key);
  select count(*) into hits
  from public.preregister_attempts
  where key = p_key and created_at > now() - make_interval(secs => p_window_seconds);
  return hits > p_max;
end;
$$;

revoke all on function public.hit_preregister_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.hit_preregister_rate_limit(text, integer, integer) to service_role;

-- 하루 지난 기록은 매일 새벽 3시 10분(한국 시간)에 지웁니다.
select cron.schedule(
  'purge-preregister-attempts',
  '10 18 * * *',
  $$delete from public.preregister_attempts where created_at < now() - interval '1 day'$$
);
