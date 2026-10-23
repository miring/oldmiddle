create schema if not exists admin;
revoke all on schema admin from public, anon, authenticated;

-- 지역별 (취소 제외)
create view admin.region_stats as
select region_code,
       count(*) filter (where gender = 'F') as female,
       count(*) filter (where gender = 'M') as male,
       count(*) as total
from public.preregistrations
where canceled_at is null
group by region_code
order by total desc;

-- 성별 × 연령대 (취소 제외)
create view admin.gender_age_stats as
select gender, age_group, count(*) as total
from public.preregistrations
where canceled_at is null
group by gender, age_group
order by gender, age_group;

-- 일별 신청·취소·광고 동의 (한국 날짜 기준)
create view admin.daily_stats as
select (created_at at time zone 'Asia/Seoul')::date as day,
       count(*) as signed_up,
       count(canceled_at) as canceled,
       count(marketing_agreed_at) as marketing_agreed
from public.preregistrations
group by 1
order by 1 desc;