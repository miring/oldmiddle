-- 저장 함수(Edge Function)가 쓰는 service_role 권한을 명시적으로 줍니다.
-- 프로젝트 설정에 따라 새 표에 자동 권한이 붙지 않을 수 있어서, 기본값에 기대지 않습니다.
-- anon·authenticated는 그대로 잠금 상태입니다.
grant select, insert, update, delete on table public.preregistrations to service_role;
grant execute on function public.count_region_preregistrations(text) to service_role;
