import styles from './LetterCard.module.css'

type LetterCardProps = {
  title: string
  /** 날짜 도장 글자 (예: "11.04") */
  date: string
  /** 질문 예시 */
  questions: string[]
  /** 구분선 아래 작은 안내 (휴대폰 편지에서만) */
  notes?: string[]
}

/** 교환일기 편지지 (정식 홈 "이용 흐름"). 크기·여백은 화면 폭에 따라 토큰으로 바뀝니다 */
export function LetterCard({ title, date, questions, notes }: LetterCardProps) {
  return (
    <div className={`${styles.letter} flex flex-col gap-2 p-4.5 xl:gap-3 xl:p-7`}>
      {/* 아주 좁은 화면(큰 글씨·확대)에서는 도장이 다음 줄로 */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className={`${styles.title} min-w-0`}>{title}</p>
        {/* 예시 날짜라 화면 읽기 프로그램에서는 건너뜀 */}
        <span className={`${styles.stamp} shrink-0 px-2 xl:px-2.5`} aria-hidden="true">
          {date}
        </span>
      </div>
      <ul role="list" className={styles.questions}>
        {questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ul>
      {notes && (
        <>
          <hr className={styles.rule} />
          <ul role="list" className={styles.notes}>
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
