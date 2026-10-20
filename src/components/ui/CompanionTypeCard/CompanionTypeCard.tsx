import styles from './CompanionTypeCard.module.css'

type CompanionTypeCardProps = {
  name: string
  summary: string
  image: string
  /**
   * horizontal: 작은 그림 왼쪽 + 글 오른쪽 / vertical: 큰 그림 위 + 글 아래
   * responsive: 모바일은 horizontal, 태블릿 이상은 vertical
   */
  layout?: 'horizontal' | 'vertical' | 'responsive'
  /** 이름 제목 수준. 놓이는 화면의 제목 구조에 맞춰 고릅니다 */
  titleAs?: 'h2' | 'h3' | 'h4' | 'p'
}

const LAYOUT = {
  horizontal: { root: 'flex items-center gap-4', image: 'size-(--size-type-thumb)', text: '' },
  vertical: { root: 'flex flex-col gap-4', image: 'h-(--size-type-image-height) w-full', text: 'px-3' },
  responsive: {
    root: 'flex items-center gap-4 md:flex-col md:items-stretch',
    image: 'size-(--size-type-thumb) md:h-(--size-type-image-height) md:w-full',
    text: 'md:px-3',
  },
}

/** 동행 유형 소개 카드(정적). 랜딩 "네 가지 마음", 이후 앱의 유형 안내에서 씁니다. */
export function CompanionTypeCard({
  name,
  summary,
  image,
  layout = 'responsive',
  titleAs: Title = 'h3',
}: CompanionTypeCardProps) {
  const classes = LAYOUT[layout]

  return (
    <div className={classes.root}>
      {/* 이름과 설명이 글로 있으므로 그림은 장식용(alt 비움) */}
      <img className={`${styles.image} shrink-0 ${classes.image}`} src={image} alt="" />
      <div className={`flex min-w-0 flex-1 flex-col gap-2 ${classes.text}`}>
        <Title className={styles.name}>{name}</Title>
        <p className={styles.summary}>{summary}</p>
      </div>
    </div>
  )
}
