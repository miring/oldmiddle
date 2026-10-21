import { useEffect, useRef, type FormEvent, type MouseEvent } from 'react'
import { BackHeader } from '../../components/ui/BackHeader/BackHeader'
import { Button } from '../../components/ui/Button/Button'
import { ChoiceChipGroup } from '../../components/ui/ChoiceChipGroup/ChoiceChipGroup'
import { ConsentGroup } from '../../components/ui/ConsentGroup/ConsentGroup'
import { SelectField } from '../../components/ui/SelectField/SelectField'
import { TextField } from '../../components/ui/TextField/TextField'
import { COPY } from '../../config/copy'
import { MOCK_SMS_VERIFICATION } from '../../config/devFlags'
import { RESULT_HASH, goBackTo } from '../quiz/quizRoute'
import {
  AGE_OPTIONS,
  CONSENT_ITEMS,
  GENDER_OPTIONS,
  REGIONS,
  UNDER_45,
  formatPhone,
  isValidMobile,
} from './preregisterOptions'
import { updateDraft, usePreregisterDraft } from './preregisterDraft'
import { TestModeBanner } from './TestModeBanner'
import styles from './PreregisterPage.module.css'

/** 사전 신청 폼 (Figma "사전신청 01 신청 폼" — 구조·문구만 참고) */
export function PreregisterPage() {
  const draft = usePreregisterDraft()
  const codeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const province = REGIONS.find((region) => region.code === draft.province)
  const needsDistrict = province ? province.districts.length > 0 : true
  const phoneValid = isValidMobile(draft.phone)
  const codeComplete = /^\d{6}$/.test(draft.code)
  // TODO(문자 인증): 서버에 인증번호 검증을 요청하고 결과로 판단합니다 (docs/운영-준비.md).
  // 지금은 개발용 목업 플래그가 켜져 있을 때만 6자리 입력으로 통과 처리합니다.
  const verified = draft.codeRequested && codeComplete && MOCK_SMS_VERIFICATION
  const requiredAgreed = CONSENT_ITEMS.filter((item) => item.required).every((item) => draft.consents[item.id])

  // 위에서부터 빠진 항목 하나만 안내 (버튼이 왜 안 눌리는지 알 수 있게)
  const missing = !draft.gender
    ? '성별을 골라 주세요'
    : !draft.age
      ? '연령대를 골라 주세요'
      : draft.age === UNDER_45
        ? '45세 이상만 신청할 수 있어요'
        : !draft.province || (needsDistrict && !draft.district)
          ? '사는 지역을 골라 주세요'
          : !phoneValid
            ? '휴대폰 번호를 입력해 주세요'
            : !verified
              ? '인증번호를 확인해 주세요'
              : !requiredAgreed
                ? '필수 항목 2개에 동의하면 누를 수 있어요'
                : null

  const requestCode = () => {
    // TODO(문자 인증): 서버에 인증번호 발송 요청 (재발송 횟수 제한 포함). 지금은 입력칸만 보여 줍니다.
    updateDraft({ codeRequested: true, code: '' })
    requestAnimationFrame(() => codeRef.current?.focus())
  }

  const codeHint = !MOCK_SMS_VERIFICATION
    ? '문자 인증은 준비 중이에요.'
    : verified
      ? '확인됐어요. (테스트 — 실제 문자는 보내지 않아요)'
      : '문자로 받은 6자리를 입력해 주세요. (테스트 중: 아무 6자리나 통과)'

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (missing) return
    // 신청 완료 화면(4단계)에서 연결합니다.
  }

  const handlePrivacyClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // TODO: 개인정보 처리방침 화면이 생기면 연결합니다.
    event.preventDefault()
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* 테스트 띠 높이가 글자 줄 수에 따라 달라지므로 fixed 대신 sticky로 함께 고정 */}
      <div className="sticky top-0 z-(--z-header)">
        <TestModeBanner />
        <BackHeader title="사전 신청" onBack={() => goBackTo(RESULT_HASH)} />
      </div>
      <main className="mx-auto flex w-full max-w-(--size-quiz-column-width) flex-col gap-7 px-6 pb-10">
        <div className="flex flex-col gap-1.5 pt-2">
          <h1 className={styles.title}>4가지만 알려 주세요</h1>
          <p className={styles.body}>{COPY.notCollected}</p>
        </div>

        <form className="flex flex-col gap-7" onSubmit={handleSubmit} noValidate>
          <ChoiceChipGroup
            legend="성별"
            name="gender"
            options={GENDER_OPTIONS}
            value={draft.gender}
            onChange={(gender) => updateDraft({ gender })}
          />

          <ChoiceChipGroup
            legend="연령대"
            name="age"
            columns={3}
            options={AGE_OPTIONS}
            value={draft.age}
            onChange={(age) => updateDraft({ age })}
          />

          <fieldset className="flex flex-col gap-2.5">
            <legend className={`${styles.legend} mb-2.5`}>사는 지역</legend>
            <div className={`grid gap-2.5 ${needsDistrict ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <SelectField
                label="시·도"
                hideLabel
                name="province"
                value={draft.province}
                placeholder="시·도"
                options={REGIONS.map((region) => ({ value: region.code, label: region.name }))}
                onChange={(code) => updateDraft({ province: code, district: '' })}
              />
              {needsDistrict && (
                <SelectField
                  label="시·군·구"
                  hideLabel
                  name="district"
                  value={draft.district}
                  placeholder="시·군·구"
                  disabled={!province}
                  options={(province?.districts ?? []).map((d) => ({ value: d.code, label: d.name }))}
                  onChange={(code) => updateDraft({ district: code })}
                />
              )}
            </div>
            {!needsDistrict && <p className={styles.hint}>{province?.name}는 따로 고를 시·군·구가 없어요.</p>}
          </fieldset>

          <div className="flex flex-col gap-2.5">
            <TextField
              label="휴대폰 번호"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="010-0000-0000"
              value={draft.phone}
              onChange={(value) => updateDraft({ phone: formatPhone(value), codeRequested: false, code: '' })}
              hint={draft.codeRequested ? undefined : '오픈 소식을 보내 드릴 번호예요. 전화로 권유하지 않아요.'}
              trailing={
                <div className="w-26 shrink-0">
                  <Button variant="secondary" disabled={!phoneValid} onClick={requestCode}>
                    {draft.codeRequested ? '다시 받기' : '인증번호'}
                  </Button>
                </div>
              }
            />
            {draft.codeRequested && (
              <TextField
                label="인증번호"
                hideLabel
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="인증번호 6자리"
                maxLength={6}
                inputRef={codeRef}
                value={draft.code}
                onChange={(value) => updateDraft({ code: value.replace(/\D/g, '').slice(0, 6) })}
                hint={codeHint}
              />
            )}
          </div>

          <ConsentGroup
            allLabel="전체 동의 (선택 포함)"
            items={CONSENT_ITEMS}
            values={draft.consents}
            onChange={(consents) => updateDraft({ consents })}
          />

          <div className="flex flex-col items-center gap-2.5">
            <Button type="submit" disabled={Boolean(missing)}>
              잘 맞는 유형 보기
            </Button>
            <p className={styles.hint} aria-live="polite">
              {missing ?? '선택 항목은 체크하지 않아도 신청돼요'}
            </p>
            <a href="#" className={styles.link} onClick={handlePrivacyClick}>
              개인정보 처리방침
            </a>
          </div>
        </form>
      </main>
    </div>
  )
}
