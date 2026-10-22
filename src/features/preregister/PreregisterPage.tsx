import { useEffect, useId, useRef, useState, type FocusEvent, type FormEvent, type MouseEvent } from 'react'
import { BackHeader } from '../../components/ui/BackHeader/BackHeader'
import { Button } from '../../components/ui/Button/Button'
import { BottomSheet } from '../../components/ui/BottomSheet/BottomSheet'
import { useBottomSheet } from '../../components/ui/BottomSheet/useBottomSheet'
import { ChoiceChipGroup } from '../../components/ui/ChoiceChipGroup/ChoiceChipGroup'
import { ConsentGroup } from '../../components/ui/ConsentGroup/ConsentGroup'
import { FieldMessage } from '../../components/ui/FieldMessage/FieldMessage'
import { SelectField } from '../../components/ui/SelectField/SelectField'
import { TextField } from '../../components/ui/TextField/TextField'
import { CONSENT_COPY, COPY, PREREGISTER_CONFIRM_COPY, PREREGISTER_FORM_COPY } from '../../config/copy'
import { MOCK_SMS_VERIFICATION } from '../../config/devFlags'
import { useQuizAnswers } from '../quiz/quizAnswers'
import { RESULT_HASH, UNDER45_HASH, goBackTo, navigate } from '../quiz/quizRoute'
import { calculateResult } from '../quiz/results'
import {
  AGE_OPTIONS,
  CONSENT_ITEMS,
  GENDER_OPTIONS,
  REGIONS,
  UNDER_45,
  formatPhone,
  isValidMobile,
} from './preregisterOptions'
import { getDraft, updateDraft, usePreregisterDraft } from './preregisterDraft'
import { ConfirmSheetContent } from './ConfirmSheetContent'
import { ConsentDetails } from './ConsentDetails'
import { buildPreregisterPayload, submitPreregistration } from './submitPreregistration'
import { TestModeBanner } from './TestModeBanner'
import styles from './PreregisterPage.module.css'

// 시·도를 바꾸면 시·군·구를 다시 고르게 비움. 시·군·구가 없는 곳(세종)은 시·도 코드를 시·군·구 코드로 씀
function districtCodeFor(provinceCode: string): string {
  const region = REGIONS.find((r) => r.code === provinceCode)
  return region && region.districts.length === 0 ? provinceCode : ''
}

// 검사하는 칸. 이 순서대로 첫 번째 오류 칸으로 이동합니다
type FieldKey = 'gender' | 'age' | 'region' | 'phone' | 'code' | 'consent'
const FIELD_ORDER: FieldKey[] = ['gender', 'age', 'region', 'phone', 'code', 'consent']
const ERRORS = PREREGISTER_FORM_COPY.errors

// 포커스가 묶음(fieldset 등) 밖으로 나갈 때만 true — 묶음 안 칩·선택 상자끼리 옮겨 다닐 때는 검사하지 않음
function leftGroup(event: FocusEvent<HTMLElement>) {
  return !event.currentTarget.contains(event.relatedTarget as Node | null)
}

// 동의 항목마다 [보기]로 펼칠 내용을 붙임 (문구는 src/config/copy.ts)
const CONSENT_ITEMS_WITH_DETAILS = CONSENT_ITEMS.map((item) => ({ ...item, details: <ConsentDetails id={item.id} /> }))

/** 사전 신청 폼 (Figma "사전신청 01 신청 폼" — 구조·문구만 참고) */
export function PreregisterPage() {
  const draft = usePreregisterDraft()
  const codeRef = useRef<HTMLInputElement>(null)
  const genderRef = useRef<HTMLDivElement>(null)
  const ageRef = useRef<HTMLDivElement>(null)
  const regionRef = useRef<HTMLFieldSetElement>(null)
  const provinceRef = useRef<HTMLSelectElement>(null)
  const districtRef = useRef<HTMLSelectElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const codeButtonRef = useRef<HTMLDivElement>(null)
  const consentRef = useRef<HTMLDivElement>(null)

  // 오류를 보여 줄 칸: 칸을 벗어날 때(blur)와 신청 버튼을 누를 때만 켬. 입력하는 도중에는 켜지 않음
  const [shown, setShown] = useState<Partial<Record<FieldKey, boolean>>>({})
  const answers = useQuizAnswers()

  // 확인 바텀시트: [고치기]·바깥·ESC·뒤로 가기로 닫으면 입력값은 그대로, 포커스는 휴대폰 번호 칸으로
  const sheet = useBottomSheet({ onClose: () => phoneRef.current?.focus() })
  const [confirming, setConfirming] = useState(false)
  const confirmingRef = useRef(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const regionMessageId = useId()

  useEffect(() => {
    // 45세 미만 안내에서 돌아왔으면('연령대 다시 고르기'·뒤로 가기) 연령대만 비우고 그 질문으로 옮김 (나머지 입력값은 그대로)
    if (getDraft().age === UNDER_45) {
      updateDraft({ age: null })
      ageRef.current?.scrollIntoView({ block: 'center' })
      ageRef.current?.querySelector('input')?.focus({ preventScroll: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [])

  // '45 미만'을 고르면 바로 안내 화면으로 (저장하는 값 없음)
  const handleAgeChange = (age: string) => {
    updateDraft({ age })
    if (age === UNDER_45) navigate(UNDER45_HASH)
  }

  const province = REGIONS.find((region) => region.code === draft.province)
  const needsDistrict = province ? province.districts.length > 0 : true
  const phoneDigits = draft.phone.replace(/\D/g, '')
  const phoneValid = isValidMobile(draft.phone)
  const codeComplete = /^\d{6}$/.test(draft.code)
  // TODO(문자 인증): 서버에 인증번호 검증을 요청하고 결과로 판단합니다 (docs/운영-준비.md).
  // 지금은 개발용 목업 플래그가 켜져 있을 때만 6자리 입력으로 통과 처리합니다.
  const verified = draft.codeRequested && codeComplete && MOCK_SMS_VERIFICATION
  const requiredAgreed = CONSENT_ITEMS.filter((item) => item.required).every((item) => draft.consents[item.id])

  // 칸마다 지금 값의 오류 (무엇을 고치면 되는지)
  const errors: Record<FieldKey, string | null> = {
    gender: draft.gender ? null : ERRORS.gender,
    age: draft.age && draft.age !== UNDER_45 ? null : ERRORS.age,
    region: !draft.province ? ERRORS.province : !draft.district ? ERRORS.district : null,
    phone: phoneValid
      ? null
      : !phoneDigits
        ? ERRORS.phoneEmpty
        : !/^0(1[016789]?)?$/.test(phoneDigits.slice(0, 3)) // 앞자리가 010·011 등이 아님
          ? ERRORS.phonePrefix
          : ERRORS.phoneShort,
    // 번호가 맞을 때만 인증을 따짐 (번호 오류가 먼저)
    code: !phoneValid
      ? null
      : !draft.codeRequested
        ? ERRORS.codeNotRequested
        : !codeComplete
          ? ERRORS.codeShort
          : !verified
            ? ERRORS.codeNotVerified
            : null,
    consent: requiredAgreed ? null : ERRORS.consent,
  }
  // 위에서부터 첫 번째로 빠진 칸 (없으면 신청 가능)
  const missing = FIELD_ORDER.find((key) => errors[key]) ?? null
  const errorOf = (key: FieldKey) => (shown[key] ? errors[key] : null)

  // 오류를 고치면 바로 표시를 끔. 다시 틀려도 칸을 벗어나거나 버튼을 누르기 전까지는 띄우지 않음
  // (값이 바뀐 그 렌더에서 바로 맞춤 — React의 '렌더 중 상태 조정' 방식)
  const fixedKeys = FIELD_ORDER.filter((key) => shown[key] && !errors[key])
  if (fixedKeys.length > 0) {
    setShown({ ...shown, ...Object.fromEntries(fixedKeys.map((key) => [key, false])) })
  }

  const reveal = (key: FieldKey) => setShown((prev) => ({ ...prev, [key]: Boolean(errors[key]) }))

  // 오류 칸으로 스크롤하고 포커스 (화면 읽기 프로그램이 오류 문구까지 읽도록 입력 요소에)
  const focusField = (key: FieldKey) => {
    const targets: Record<FieldKey, [HTMLElement | null, HTMLElement | null | undefined]> = {
      gender: [genderRef.current, genderRef.current?.querySelector('input')],
      age: [ageRef.current, ageRef.current?.querySelector('input')],
      region: [regionRef.current, draft.province ? districtRef.current : provinceRef.current],
      phone: [phoneRef.current, phoneRef.current],
      code: draft.codeRequested
        ? [codeRef.current, codeRef.current]
        : [codeButtonRef.current, codeButtonRef.current?.querySelector('button')],
      // 체크 안 된 첫 번째 필수 항목 (체크박스 순서: 전체 동의, 그다음 항목 순서대로)
      consent: [
        consentRef.current,
        consentRef.current?.querySelectorAll<HTMLInputElement>('input[type=checkbox]')[
          1 + CONSENT_ITEMS.findIndex((item) => item.required && !draft.consents[item.id])
        ],
      ],
    }
    const [box, input] = targets[key]
    box?.scrollIntoView({ block: 'center' })
    input?.focus({ preventScroll: true })
  }

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

  // 신청하기: 검사 → 통과하면 확인 바텀시트 (아직 저장하지 않음)
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (missing) {
      setShown(Object.fromEntries(FIELD_ORDER.map((key) => [key, Boolean(errors[key])])))
      focusField(missing)
      return
    }
    setConfirmError(null)
    sheet.show()
  }

  // 이대로 신청하기: 여기서 저장. 끝날 때까지 버튼을 막아 두 번 저장되지 않게
  const handleConfirm = async () => {
    if (confirmingRef.current) return
    confirmingRef.current = true
    setConfirming(true)
    setConfirmError(null)
    try {
      await submitPreregistration(buildPreregisterPayload(draft, calculateResult(answers)))
      // TODO(신청 완료 화면): [3]에서 완료 화면으로 이동합니다. 지금은 바텀시트만 닫습니다.
      sheet.close()
    } catch {
      setConfirmError(PREREGISTER_CONFIRM_COPY.failed) // 실패하면 바텀시트를 닫지 않고 안에 오류 표시
    } finally {
      confirmingRef.current = false
      setConfirming(false)
    }
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
          <div ref={genderRef} onBlur={(event) => leftGroup(event) && reveal('gender')}>
            <ChoiceChipGroup
              legend="성별"
              name="gender"
              options={GENDER_OPTIONS}
              value={draft.gender}
              onChange={(gender) => updateDraft({ gender })}
              error={errorOf('gender')}
            />
          </div>

          <div ref={ageRef} onBlur={(event) => leftGroup(event) && reveal('age')}>
            <ChoiceChipGroup
              legend="연령대"
              name="age"
              columns={3}
              options={AGE_OPTIONS}
              value={draft.age}
              onChange={handleAgeChange}
              error={errorOf('age')}
            />
          </div>

          <fieldset
            ref={regionRef}
            className="flex flex-col gap-2.5"
            onBlur={(event) => leftGroup(event) && reveal('region')}
          >
            <legend className={`${styles.legend} mb-2.5`}>사는 지역</legend>
            <div className={`grid gap-2.5 ${needsDistrict ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <SelectField
                label="시·도"
                hideLabel
                name="province"
                value={draft.province}
                placeholder="시·도"
                options={REGIONS.map((region) => ({ value: region.code, label: region.name }))}
                onChange={(code) => updateDraft({ province: code, district: districtCodeFor(code) })}
                selectRef={provinceRef}
                invalid={errorOf('region') === ERRORS.province}
                describedBy={errorOf('region') ? regionMessageId : undefined}
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
                  selectRef={districtRef}
                  invalid={errorOf('region') === ERRORS.district}
                  describedBy={errorOf('region') ? regionMessageId : undefined}
                />
              )}
            </div>
            <FieldMessage
              id={regionMessageId}
              hint={needsDistrict ? undefined : `${province?.name}는 따로 고를 시·군·구가 없어요.`}
              error={errorOf('region')}
            />
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
              onBlur={() => reveal('phone')}
              inputRef={phoneRef}
              hint={draft.codeRequested ? undefined : '오픈 소식을 보내 드릴 번호예요. 전화로 권유하지 않아요.'}
              // 인증번호를 아직 받지 않은 오류는 번호 칸 아래에 (인증 칸이 아직 없음)
              error={errorOf('phone') ?? (draft.codeRequested ? null : errorOf('code'))}
              trailing={
                <div ref={codeButtonRef} className="w-26 shrink-0">
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
                onBlur={() => reveal('code')}
                hint={codeHint}
                error={errorOf('code')}
              />
            )}
          </div>

          {/* 동의 오류는 신청하기를 눌렀을 때만 (전체 동의 label을 누르면 포커스가 잠깐 빠져 blur로 검사하면 깜빡임) */}
          <div ref={consentRef}>
            <ConsentGroup
              allLabel={CONSENT_COPY.labels.all}
              items={CONSENT_ITEMS_WITH_DETAILS}
              values={draft.consents}
              onChange={(consents) => updateDraft({ consents })}
              agreeLabel={CONSENT_COPY.actions.agree}
              closeLabel={CONSENT_COPY.actions.close}
              error={errorOf('consent')}
            />
          </div>

          <div className="flex flex-col items-center gap-2.5">
            {/* 항상 누를 수 있음: 누르면 검사해서 첫 오류 칸으로, 통과하면 확인 바텀시트 */}
            <Button type="submit">{COPY.preregisterSubmit}</Button>
            <p className={styles.hint}>{PREREGISTER_FORM_COPY.optionalNote}</p>
            <a href="#" className={styles.link} onClick={handlePrivacyClick}>
              개인정보 처리방침
            </a>
          </div>
        </form>
      </main>

      <BottomSheet open={sheet.open} onRequestClose={sheet.close} title={PREREGISTER_CONFIRM_COPY.title}>
        <ConfirmSheetContent
          draft={draft}
          confirming={confirming}
          error={confirmError}
          onConfirm={handleConfirm}
          onEdit={sheet.close}
        />
      </BottomSheet>
    </div>
  )
}
