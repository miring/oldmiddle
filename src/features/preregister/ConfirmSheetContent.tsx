import { Button } from '../../components/ui/Button/Button'
import { FieldMessage } from '../../components/ui/FieldMessage/FieldMessage'
import { PREREGISTER_CONFIRM_COPY as C } from '../../config/copy'
import type { PreregisterDraft } from './preregisterDraft'
import { AGE_OPTIONS, GENDER_OPTIONS, REGIONS } from './preregisterOptions'
import styles from './ConfirmSheetContent.module.css'

type ConfirmSheetContentProps = {
  draft: PreregisterDraft
  confirming: boolean
  error: string | null
  onConfirm: () => void
  onEdit: () => void
}

/** "이대로 신청할까요?" 바텀시트 안 내용: 입력 요약 + 이대로 신청하기 / 고치기 */
export function ConfirmSheetContent({ draft, confirming, error, onConfirm, onEdit }: ConfirmSheetContentProps) {
  // 지역 이름은 저장하지 않고 코드로 그때그때 찾음 (세종처럼 시·군·구가 없으면 시·도만)
  const province = REGIONS.find((region) => region.code === draft.province)
  const district = province?.districts.find((d) => d.code === draft.district)
  const rows = [
    { label: C.labels.region, value: [province?.name, district?.name].filter(Boolean).join(' ') },
    { label: C.labels.age, value: AGE_OPTIONS.find((option) => option.value === draft.age)?.label },
    { label: C.labels.gender, value: GENDER_OPTIONS.find((option) => option.value === draft.gender)?.label },
    { label: C.labels.marketing, value: draft.consents.marketing ? C.marketingYes : C.marketingNo },
  ]

  return (
    <>
      <div className={`${styles.summary} flex flex-col gap-4 p-5`}>
        {/* 잘못 입력한 번호를 잡도록 가리지 않고 크게 */}
        <div className="flex flex-col gap-1">
          <p className={styles.label}>{C.labels.phone}</p>
          <p className={styles.phone}>{draft.phone}</p>
        </div>
        <dl className="flex flex-col gap-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4">
              <dt className={`${styles.label} shrink-0`}>{row.label}</dt>
              <dd className={styles.value}>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className={styles.notice}>{C.notice}</p>
      {/* 실패하면 바텀시트를 닫지 않고 여기에 (role="alert"라 나타나는 즉시 읽어 줌) */}
      {error && (
        <div role="alert">
          <FieldMessage id="preregister-confirm-error" error={error} />
        </div>
      )}
      <div className="flex flex-col gap-3">
        <Button onClick={onConfirm} disabled={confirming}>
          {confirming ? C.confirming : C.confirm}
        </Button>
        <Button variant="secondary" onClick={onEdit} disabled={confirming}>
          {C.edit}
        </Button>
      </div>
    </>
  )
}
