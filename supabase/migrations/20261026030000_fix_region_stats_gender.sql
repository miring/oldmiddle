-- 신청자 표의 성별 값('female'/'male')에 맞춰 지역별 집계의 조건을 고칩니다.
create or replace view admin.region_stats as
select region_code,
       count(*) filter (where gender = 'female') as female,
       count(*) filter (where gender = 'male') as male,
       count(*) as total
from public.preregistrations
where canceled_at is null
group by region_code
order by total desc;
