import { useId, useRef, useState, type ReactNode } from 'react'
import { Button } from '../Button/Button'
import { Checkbox } from '../Checkbox/Checkbox'
import { FieldMessage } from '../FieldMessage/FieldMessage'
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
  /** 펼친 내용 맨 아래 버튼 문구: 체크 전("동의하고 닫기") / 이미 체크됨("닫기") */
  agreeLabel: string
  closeLabel: string
  /** 오류 문구 (예: 필수 미동의). 있으면 카드 아래에 보이고, 체크 안 된 필수 항목이 오류 상태가 됨 */
  error?: string | null
}

/** 전체 동의 + 개별 동의 묶음(흰 카드). 사전 신청, 이후 정식 가입 약관 동의에서 씁니다. */
export function ConsentGroup({
  allLabel,
  items,
  values,
  onChange,
  agreeLabel,
  closeLabel,
  error,
}: ConsentGroupProps) {
  const panelIdPrefix = useId()
  const messageId = `${panelIdPrefix}-message`
  // 펼침 상태는 체크와 따로 둡니다. 여러 개를 동시에 펼칠 수 있고, 처음에는 모두 접힘
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const checkedCount = items.filter((item) => values[item.id]).length
  const allChecked = checkedCount === items.length
  const someChecked = checkedCount > 0 && !allChecked

  const setAll = (checked: boolean) => onChange(Object.fromEntries(items.map((item) => [item.id, checked])))
  const setOne = (id: string, checked: boolean) => onChange({ ...values, [id]: checked })
  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  const checkboxRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const toggleRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // "동의하고 닫기": 체크(전체 동의는 기존 계산대로 따라감) → 접기 → 체크박스로 포커스 (바뀐 상태를 읽어 주도록)
  const agreeAndClose = (id: string) => {
    setOne(id, true)
    setExpanded((prev) => ({ ...prev, [id]: false }))
    checkboxRefs.current[id]?.focus()
  }

  // "닫기"(이미 체크됨): 접고 [보기] 버튼으로 포커스. 체크 해제는 체크박스로만
  const close = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: false }))
    toggleRefs.current[id]?.focus()
  }

  return (
    <div className="flex flex-col gap-2.5">
      <fieldset
        className={`${styles.card} ${error ? styles.cardError : ''} flex flex-col gap-1 px-4 py-2`}
        aria-describedby={error ? messageId : undefined}
      >
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
                <Checkbox
                  checked={Boolean(values[item.id])}
                  onChange={(checked) => setOne(item.id, checked)}
                  invalid={Boolean(error) && item.required && !values[item.id]}
                  describedBy={error ? messageId : undefined}
                  inputRef={(element) => {
                    checkboxRefs.current[item.id] = element
                  }}
                >
                  {item.label}
                </Checkbox>
                {/* label 밖에 두어 눌러도 체크가 바뀌지 않음 */}
                {item.details && (
                  <button
                    ref={(element) => {
                      toggleRefs.current[item.id] = element
                    }}
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
                    <div className={`${styles.panelBody} mt-1 mb-2 flex flex-col gap-4 p-4`}>
                      {item.details}
                      {values[item.id] ? (
                        <Button variant="secondary" onClick={() => close(item.id)}>
                          {closeLabel}
                        </Button>
                      ) : (
                        <Button variant="secondary" onClick={() => agreeAndClose(item.id)}>
                          {agreeLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </fieldset>
      <FieldMessage id={messageId} error={error} />
    </div>
  )
}
