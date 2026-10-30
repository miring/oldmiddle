import styles from './PriceCard.module.css'

type PriceCardProps = {
  name: string
  /** 예: "월 29,000원" */
  price: string
  /** 포함 내용 (예: "월 4명 소개 · 만남 주선 1회") */
  detail: string
  /** 요금 이름 제목 수준. 놓이는 화면의 제목 구조에 맞춰 고릅니다 */
  titleAs?: 'h3' | 'h4'
}

/** 요금 카드 (정식 홈 "가입 전에 먼저 보여 드려요"). 높이는 감싸는 격자에서 맞춥니다. */
export function PriceCard({ name, price, detail, titleAs: Title = 'h3' }: PriceCardProps) {
  return (
    <div className={`${styles.card} flex h-full flex-col gap-4 p-6`}>
      <Title className={styles.name}>{name}</Title>
      <p className={styles.price}>{price}</p>
      <hr className={styles.rule} />
      <p className={styles.detail}>{detail}</p>
    </div>
  )
}
