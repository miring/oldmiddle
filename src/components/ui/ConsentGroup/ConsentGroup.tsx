import { useId, useState, type ReactNode } from 'react'
import { Checkbox } from '../Checkbox/Checkbox'
import styles from './ConsentGroup.module.css'

export type ConsentItem = {
  id: string
  /** 예: "(필수) 개인정보 수집·이용에 동의해요" */
  label: string
  required: boolean
  /** "보기"로 펼칠 내용. 없으면 "보기" 버튼을 두지 않음 */
  details?: ReactNode
}

type ConsentGroupProps = {
  /** 전체 동의 줄 문구 */
  allLabel: string
  items: ConsentItem[]
  values: Record<string, boolean>
  onChange: (values: Record<string, boolean>) => void
}

/** 전체 동의 + 개별 동의 묶음(흰 카드). 사전 신청, 이후 정식 가입 약관 동의에서 씁니다. */
export function ConsentGroup({ allLabel, items, values, onChange }: ConsentGroupProps) {
  const panelIdPrefix = useId()
  // 펼침 상태는 체크와 따로 둡니다. 여러 개를 동시에 펼칠 수 있고, 처음에는 모두 접힘
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const checkedCount = items.filter((item) => values[item.id]).length
  const allChecked = checkedCount === items.length
  const someChecked = checkedCount > 0 && !allChecked

  const setAll = (checked: boolean) => onChange(Object.fromEntries(items.map((item) => [item.id, checked])))
  const setOne = (id: string, checked: boolean) => onChange({ ...values, [id]: checked })
  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <fieldset className={`${styles.card} flex flex-col gap-1 px-4 py-2`}>
      <legend className="sr-only">약관 동의</legend>
      <div className="flex items-center">
        <Checkbox checked={allChecked} indeterminate={someChecked} onChange={setAll}>
          {allLabel}
        </Checkbox>
      </div>
      <hr className={styles.divider} />
      {items.map((item) => {
        const panelId = `${panelIdPrefix}-${item.id}`
        const isOpen = Boolean(expanded[item.id])
        return (
          <div key={item.id} className="flex flex-col">
            <div className="flex items-center gap-2">
              <Checkbox checked={Boolean(values[item.id])} onChange={(checked) => setOne(item.id, checked)}>
                {item.label}
              </Checkbox>
              {/* label 밖에 두어 눌러도 체크가 바뀌지 않음 */}
              {item.details && (
                <button
                  type="button"
                  className={`${styles.toggle} flex shrink-0 items-center justify-center`}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                >
                  {isOpen ? '접기' : '보기'}
                  <span className="sr-only">: {item.label}</span>
                </button>
              )}
            </div>
            {item.details && (
              <div id={panelId} className={styles.panel} data-open={isOpen}>
                <div className={styles.panelClip}>
                  <div className={`${styles.panelBody} mt-1 mb-2 p-4`}>{item.details}</div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </fieldset>
  )
}
