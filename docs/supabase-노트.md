# Supabase 노트

사전 신청 DB를 다룰 때 찾아보는 문서입니다. 환경, 비밀 값을 보관하는 곳, DB 구조, 자주 쓰는 명령을 모았습니다.

> **이 파일에는 비밀번호나 키 값을 절대 적지 않습니다.** 저장소에 올라가는 파일이라서, 값은 비밀번호 관리자에만 두고 여기에는 "어디에 무슨 이름으로 저장했는지"만 적습니다.

## 1. 환경 (dev / prod)

| 구분 | 프로젝트 이름 | 프로젝트 ID | 용도 |
| --- | --- | --- | --- |
| 개발 | `oldmiddle-dev` | `tslzkdfvijrajcfdiekm` | 새 기능 시험, 시험 신청, 고정 인증번호 |
| 운영 | `oldmiddle-prod` | `ywpaotxrdoktujljjjzi` | 실제 신청자 정보만 |

- 둘 다 같은 조직(Pro 요금제)에 있고, 리전은 **Northeast Asia (Seoul)**입니다. 리전은 나중에 바꿀 수 없습니다.
- 프로젝트 ID는 대시보드 주소 `supabase.com/dashboard/project/<여기>`나 Project Settings → General에서 확인합니다.
- 프로젝트 ID와 publishable 키는 비밀이 아닙니다. DB 비밀번호와 secret 키, 암호화 키는 비밀입니다.

## 2. 비밀 값 보관 목록

값은 비밀번호 관리자에 아래 이름으로 저장합니다. **dev와 prod는 항상 서로 다른 값**을 씁니다.

| 항목 | 저장 이름 (예시) | 어디에 쓰나 | 잃어버리면 |
| --- | --- | --- | --- |
| DB 비밀번호 (dev) | `oldmiddle-dev DB` | `supabase link`할 때 | 대시보드에서 재설정 가능. 연결을 다시 해야 함 |
| DB 비밀번호 (prod) | `oldmiddle-prod DB` | 위와 같음 | 위와 같음 |
| `PHONE_ENC_KEY` (dev) | `oldmiddle-dev PHONE_ENC_KEY` | 휴대폰 번호 암호화 | **저장된 번호를 되돌릴 수 없음** |
| `PHONE_ENC_KEY` (prod) | `oldmiddle-prod PHONE_ENC_KEY` | 위와 같음 | **오픈 안내를 보낼 수 없게 됨. 반드시 백업** |
| `PHONE_HASH_KEY` (dev) | `oldmiddle-dev PHONE_HASH_KEY` | 중복 확인·횟수 제한용 해시 | 중복 신청 확인이 깨짐 |
| `PHONE_HASH_KEY` (prod) | `oldmiddle-prod PHONE_HASH_KEY` | 위와 같음 | 위와 같음. **반드시 백업** |
| GitHub 복구 코드 | `GitHub recovery codes` | 휴대폰을 잃어버렸을 때 로그인 | GitHub·Supabase에 못 들어갈 수 있음 |

- 암호화 키 만드는 법: 터미널에서 `openssl rand -base64 32` (실행할 때마다 다른 값이 나옴)
- secret 키(`sb_secret_…`)는 대시보드 Project Settings → API Keys에 있습니다. 서버 함수에는 Supabase가 자동으로 넣어 주므로 따로 보관하거나 코드에 넣지 않습니다.

## 3. 비밀 값 파일 (맥에만 있음, 커밋되지 않음)

| 파일 | 위치 | 들어가는 값 |
| --- | --- | --- |
| `.env.local` | 저장소 루트 | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (화면용, 공개돼도 되는 값) |
| `supabase/functions/.env` | dev 서버 함수용 | `PHONE_ENC_KEY`, `PHONE_HASH_KEY`, `ALLOWED_ORIGINS`, `DEV_FIXED_CODE` |
| `supabase/functions/.env.prod` | prod 서버 함수용 | `PHONE_ENC_KEY`, `PHONE_HASH_KEY`, `ALLOWED_ORIGINS` (**`DEV_FIXED_CODE`는 넣지 않음**) |

- 마침표로 시작하는 파일은 Finder에서 숨겨집니다. `⌘ + Shift + .`으로 보이게 하거나 VS Code에서 엽니다.
- 등록: `npx supabase secrets set --env-file supabase/functions/.env` (prod는 `.env.prod`)
- 확인: `npx supabase secrets list` (값은 해시로만 보임)
- `ALLOWED_ORIGINS`: 개발은 `http://localhost:5173`, 운영은 Vercel 배포 주소. 끝에 `/`를 붙이지 않습니다.
- prod에 `DEV_FIXED_CODE`가 없으면 실제 문자 인증을 붙이기 전까지 저장을 거부합니다(`sms_not_ready`). 의도한 동작입니다.

## 4. DB 구조

### 표

**`public.preregistrations`** — 사전 신청자

| 칸 | 내용 |
| --- | --- |
| `id` | uuid |
| `gender` | `female` / `male` |
| `age_group` | `45-49`, `50-54`, `55-59`, `60-64`, `65+` |
| `region_code` | 시·군·구 법정동코드 5자리 (세종은 시·도 코드 `36`). 출처는 `src/data/regions.json` |
| `phone_enc` | 암호화한 번호 (`v1.` 로 시작). 발송할 때만 되돌림 |
| `phone_hash` | 번호 HMAC 해시. 중복 확인용 |
| `test_type` | 테스트 유형 결과 |
| `consent_version` | 동의한 동의서 판 (`src/config/copy.ts`의 `CONSENT_VERSION`) |
| `marketing_agreed_at` | 광고 수신 동의 시각 (동의 안 하면 비어 있음) |
| `cancel_token` | 취소 링크용 토큰 |
| `canceled_at` | 지금은 쓰지 않음 (취소하면 바로 삭제하기로 함) |
| `created_at` | 신청 시각 |

- 같은 번호는 한 번만 신청할 수 있습니다 (`phone_hash` 중복 금지).
- RLS가 켜져 있고 정책이 없습니다. 브라우저(anon)에서는 읽기·쓰기 모두 막혀 있고, 서버 함수(service_role)만 씁니다.

**`public.preregister_attempts`** — 신청 횟수 제한 기록. 번호·IP를 해시로만 남기고 하루 뒤 지웁니다.

**`admin.settings`** — 정식 오픈일(`official_open_at`). 정해지면 아래처럼 넣습니다.
```sql
update admin.settings set official_open_at = '2027-03-01 00:00+09';
```

### 함수

| 함수 | 하는 일 | 누가 부르나 |
| --- | --- | --- |
| `public.count_region_preregistrations(지역코드)` | 같은 지역 신청 수만 돌려줌 | 완료 화면 (브라우저 허용) |
| `public.hit_preregister_rate_limit(...)` | 횟수 제한 확인 | 서버 함수만 |
| `admin.purge_expired_preregistrations()` | 보관기간 지난 신청 삭제 | 자동 파기 일정 |

### 집계 보기 (SQL Editor에서 확인)

```sql
select * from admin.region_stats;      -- 지역별 여성·남성·합계
select * from admin.gender_age_stats;  -- 성별 × 연령대
select * from admin.daily_stats;       -- 일별 신청·광고 동의
```

- `admin` 스키마는 API에 공개되지 않습니다. Project Settings → API의 Exposed schemas에 `admin`을 **추가하지 않습니다.**
- 한 창에 쿼리 여러 개를 넣으면 마지막 결과만 보입니다. 실행할 줄만 드래그해서 Run을 누릅니다.

### 자동 실행 일정 (pg_cron)

| 이름 | 시간 (한국) | 하는 일 |
| --- | --- | --- |
| `purge-expired-preregistrations` | 매일 03:00 | 신청 후 1년, 또는 정식 오픈 후 6개월이 지난 신청 삭제 |
| `purge-preregister-attempts` | 매일 03:10 | 하루 지난 횟수 제한 기록 삭제 |

```sql
select jobname, schedule from cron.job;  -- 등록 확인
```

### 서버 함수 (Edge Functions)

| 함수 | 하는 일 |
| --- | --- |
| `preregister` | 입력·인증번호 확인 → 횟수 제한 → 번호 암호화·해시 → 저장 → 같은 지역 신청 수 반환 |
| `preregister-cancel` | 취소 토큰으로 신청 바로 삭제. 취소 링크: `https://<사이트>/#/cancel/<cancel_token>` |

오류 응답: `invalid_input`, `invalid_code`, `sms_not_ready`, `already_registered`, `too_many_requests`, `origin_not_allowed`, `save_failed`(`reason`에 DB 오류 코드), `not_found`(취소)

## 5. 마이그레이션 규칙

- 표·함수를 바꾸는 SQL은 **항상** `npx supabase migration new <이름>`으로 파일을 만들고 `npx supabase db push`로 적용합니다. 대시보드 SQL Editor에서 바로 바꾸면 운영 DB를 만들 때 그 부분이 빠집니다.
- 이미 적용한 마이그레이션 파일은 고치지 않습니다. 바꿀 내용은 새 파일로 추가합니다.
- 지금까지의 파일 (순서대로 적용됨):
  1. `20261023071933_create_preregistrations.sql` — 신청자 표, RLS, 지역 신청 수 함수
  2. `20261023074419_create_admin_stats.sql` — 집계 보기
  3. `20261026020000_grant_service_role_preregistrations.sql` — 서버 함수 권한
  4. `20261026030000_fix_region_stats_gender.sql` — 집계 보기 성별 값 수정
  5. `20261026050000_purge_expired_preregistrations.sql` — 자동 파기
  6. `20261027010000_preregister_rate_limit.sql` — 횟수 제한

## 6. 자주 쓰는 명령

모두 oldmiddle 폴더(저장소 루트)의 터미널에서 실행합니다. `npm`이 아니라 **`npx`**입니다. 오타(`supabse`)가 잦으니 복사해서 붙여 넣습니다.

```bash
npx supabase projects list            # 지금 연결된 프로젝트 확인 (● 표시)
npx supabase link --project-ref <ID>  # 연결할 프로젝트 바꾸기
npx supabase db push                  # 마이그레이션 적용 (연결된 프로젝트에!)
npx supabase functions deploy preregister
npx supabase functions deploy preregister-cancel
npx supabase secrets list
```

> **`db push`와 `functions deploy`는 지금 연결된 프로젝트에 적용됩니다.** 운영 작업을 마치면 바로 개발로 다시 연결합니다: `npx supabase link --project-ref tslzkdfvijrajcfdiekm`

## 7. 운영 DB 만드는 순서 (한 번만)

1. 같은 Pro 조직에서 New project → `oldmiddle-prod`, Seoul 리전, DB 비밀번호는 비밀번호 관리자에 저장
2. 위 1번 표에 프로젝트 ID 적기
3. `supabase/functions/.env.prod` 만들기 (새 키 2개, `ALLOWED_ORIGINS`. `DEV_FIXED_CODE` 없음) → 키를 비밀번호 관리자에 저장
4. 실행:
   ```bash
   npx supabase link --project-ref <운영 ID>
   npx supabase db push
   npx supabase secrets set --env-file supabase/functions/.env.prod
   npx supabase functions deploy preregister
   npx supabase functions deploy preregister-cancel
   npx supabase link --project-ref tslzkdfvijrajcfdiekm
   ```
5. 운영 대시보드에서 확인: Table Editor에 표, `select jobname from cron.job;`에 일정 2개
6. Vercel 환경변수에 운영 주소와 publishable 키 넣기

## 8. 문제가 생겼을 때

| 증상 | 확인할 것 |
| --- | --- |
| "신청하지 못했어요" | 개발자 도구 Network → `preregister` → Response의 `error` 값 (4번 오류 응답 표) |
| `save_failed` | `reason` 코드: `42501` 권한, `23514` 값 형식(check), `42P01` 표 없음. 대시보드 Edge Functions → Logs |
| `origin_not_allowed` | `ALLOWED_ORIGINS`와 화면 주소(포트까지) 비교 |
| `secrets set`이 "No arguments found" | `.env` 파일 이름·위치·저장 여부, `cut -d= -f1 supabase/functions/.env`로 줄 이름 확인 |
| 화면 띠가 "저장되지 않아요" | `.env.local` 위치(저장소 루트)와 이름, 개발 서버 다시 켜기 |
