import styles from './LetterCard.module.css'

type LetterCardProps = {
  /** '첫 번째 편지 · 11월 2일' */
  heading: string
  question: string
  /** 함께 열린 답. 내 답만 있으면 내 답만 */
  answers: { who: string; answer: string; extra?: string }[]
}

/** 교환일기 편지 한 통: 질문 + 두 사람의 답 (Figma Diary/LetterCard). 편지 본문은 18px */
export function LetterCard({ heading, question, answers }: LetterCardProps) {
  return (
    <article className={`${styles.card} flex flex-col gap-3 p-6`}>
      <p className={styles.heading}>{heading}</p>
      <h3 className={styles.question}>{question}</h3>
      {answers.map((item) => (
        <div key={item.who} className={`${styles.answer} flex flex-col gap-3 pt-3`}>
          <p className={styles.who}>{item.who}</p>
          <p className={styles.text}>{item.answer}</p>
          {item.extra && <p className={styles.text}>{item.extra}</p>}
        </div>
      ))}
    </article>
  )
}
