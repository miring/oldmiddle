import { useEffect, useId, useRef, useState, type FocusEvent, type FormEvent, type MouseEvent } from 'react'
import { Badge } from '../../components/ui/Badge/Badge'
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
import { useQuizAnswers } from '../quiz/quizAnswers'
import { CHECK_EMAIL_HASH, PRIVACY_HASH, RESULT_HASH, UNDER45_HASH, goBackTo, navigate } from '../quiz/quizRoute'
import { calculateResult } from '../quiz/results'
import {
  AGE_OPTIONS,
  CONSENT_ITEMS,
  GENDER_OPTIONS,
  REGIONS,
  UNDER_45,
  isValidEmail,
} from './preregisterOptions'
import { setPendingEmail } from './preregisterDone'
import { getDraft, updateDraft, usePreregisterDraft } from './preregisterDraft'
import { ConfirmSheetContent } from './ConfirmSheetContent'
import { ConsentDetails } from './ConsentDetails'
import { PreregisterError, buildPreregisterPayload, submitPreregistration } from './submitPreregistration'
import { TestModeBanner } from './TestModeBanner'
import styles from './PreregisterPage.module.css'

// 시·도를 바꾸면 시·군·구를 다시 고르게 비움. 시·군·구가 없는 곳(세종)은 시·도 코드를 시·군·구 코드로 씀
function districtCodeFor(provinceCode: string): string {
  const region = REGIONS.find((r) => r.code === provinceCode)
  return region && region.districts.length === 0 ? provinceCode : ''
}

// 검사하는 칸. 이 순서대로 첫 번째 오류 칸으로 이동합니다
type FieldKey = 'gender' | 'age' | 'region' | 'email' | 'consent'
const FIELD_ORDER: FieldKey[] = ['gender', 'age', 'region', 'email', 'consent']
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
  const genderRef = useRef<HTMLDivElement>(null)
  const ageRef = useRef<HTMLDivElement>(null)
  const regionRef = useRef<HTMLFieldSetElement>(null)
  const provinceRef = useRef<HTMLSelectElement>(null)
  const districtRef = useRef<HTMLSelectElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLDivElement>(null)

  // 오류를 보여 줄 칸: 칸을 벗어날 때(blur)와 신청 버튼을 누를 때만 켬. 입력하는 도중에는 켜지 않음
  const [shown, setShown] = useState<Partial<Record<FieldKey, boolean>>>({})
  const answers = useQuizAnswers()

  // 확인 바텀시트: [고치기]·바깥·ESC·뒤로 가기로 닫으면 입력값은 그대로, 포커스는 메일 주소 칸으로
  const sheet = useBottomSheet({ onClose: () => emailRef.current?.focus() })
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
  const requiredAgreed = CONSENT_ITEMS.filter((item) => item.required).every((item) => draft.consents[item.id])

  // 칸마다 지금 값의 오류 (무엇을 고치면 되는지)
  const errors: Record<FieldKey, string | null> = {
    gender: draft.gender ? null : ERRORS.gender,
    age: draft.age && draft.age !== UNDER_45 ? null : ERRORS.age,
    region: !draft.province ? ERRORS.province : !draft.district ? ERRORS.district : null,
    // 메일이 실제로 받아지는지는 신청 뒤 확인 메일 링크로 확인
    email: !draft.email.trim() ? ERRORS.emailEmpty : isValidEmail(draft.email) ? null : ERRORS.emailInvalid,
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
      email: [emailRef.current, emailRef.current],
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
      // '메일함을 확인해 주세요' 화면에 보여 줄 주소만 메모리로 넘김 (신청 완료는 메일 속 링크에서)
      setPendingEmail(draft.email.trim())
      // 바텀시트 기록을 되돌린 뒤 신청 폼 기록을 메일 확인 화면으로 바꿈 → 뒤로 가기 하면 결과 화면 (다시 제출 방지)
      // 입력값은 지우지 않음: 메일 주소를 잘못 넣었으면 그 칸만 고쳐 다시 신청 (확인을 마치면 ConfirmPage가 지움)
      sheet.close({ then: () => navigate(CHECK_EMAIL_HASH, { replace: true }) })
    } catch (error) {
      const code = error instanceof PreregisterError ? error.code : null
      setConfirmError(
        code === 'already_registered'
          ? PREREGISTER_CONFIRM_COPY.alreadyRegistered
          : code === 'too_many_requests'
            ? PREREGISTER_CONFIRM_COPY.tooMany
            : code === 'email_failed'
              ? PREREGISTER_CONFIRM_COPY.mailFailed
              : PREREGISTER_CONFIRM_COPY.failed,
      ) // 실패하면 바텀시트를 닫지 않고 안에 오류 표시
    } finally {
      confirmingRef.current = false
      setConfirming(false)
    }
  }

  // navigate로 이동해야 처리방침 화면의 뒤로 버튼이 이 화면으로 돌아옵니다 (입력값은 메모리에 남아 그대로)
  const handlePrivacyClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    navigate(PRIVACY_HASH)
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
          <Badge className="mb-1.5">{COPY.audienceBadge}</Badge>
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

          <TextField
            label="메일 주소"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="예: hong@naver.com"
            value={draft.email}
            onChange={(email) => updateDraft({ email })}
            onBlur={() => reveal('email')}
            inputRef={emailRef}
            hint={PREREGISTER_FORM_COPY.emailHint}
            error={errorOf('email')}
          />

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
            <a href={PRIVACY_HASH} className={styles.link} onClick={handlePrivacyClick}>
              개인정보 처리방침
            </a>
          </div>
        </form>
      </main>

      <BottomSheet open={sheet.open} onRequestClose={() => sheet.close()} title={PREREGISTER_CONFIRM_COPY.title}>
        <ConfirmSheetContent
          draft={draft}
          confirming={confirming}
          error={confirmError}
          onConfirm={handleConfirm}
          onEdit={() => sheet.close()}
        />
      </BottomSheet>
    </div>
  )
}
