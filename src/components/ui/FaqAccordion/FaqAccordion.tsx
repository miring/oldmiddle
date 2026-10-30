import { useId, useState } from 'react'
import styles from './FaqAccordion.module.css'

export type FaqAccordionItem = { id: string; question: string; answer: string }

type FaqAccordionProps = {
  items: FaqAccordionItem[]
  /** 처음부터 펼쳐 둘 질문 id */
  defaultOpenIds?: string[]
  /** 질문 제목 수준. 놓이는 화면의 제목 구조에 맞춰 고릅니다 */
  headingAs?: 'h3' | 'h4'
}

/**
 * 질문을 누르면 답이 펼쳐지는 목록 (랜딩·정식 홈 "자주 묻는 질문").
 * 질문은 제목 안의 버튼이라 키보드·화면 읽기 프로그램에서 펼침 상태(aria-expanded)를 알 수 있습니다.
 * 여러 질문을 동시에 펼칠 수 있습니다.
 */
export function FaqAccordion({ items, defaultOpenIds = [], headingAs: Heading = 'h3' }: FaqAccordionProps) {
  const baseId = useId()
  const [openIds, setOpenIds] = useState(() => new Set(defaultOpenIds))

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    // role="list": 목록 기호를 없앤 목록도 iOS VoiceOver가 목록으로 읽도록
    <ul role="list" className="flex flex-col gap-3">
      {items.map((item) => {
        const open = openIds.has(item.id)
        const buttonId = `${baseId}-${item.id}-q`
        const panelId = `${baseId}-${item.id}-a`
        return (
          <li key={item.id} className={styles.item}>
            <Heading>
              <button
                type="button"
                id={buttonId}
                className={`${styles.trigger} flex w-full items-center gap-3 px-5 py-4.5`}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span className={`${styles.question} min-w-0 flex-1`}>{item.question}</span>
                <span className={`${styles.icon} shrink-0`} aria-hidden="true">
                  {open ? '−' : '+'}
                </span>
              </button>
            </Heading>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="px-5 pb-5">
              <p className={styles.answer}>{item.answer}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
