import heroCafe from '../../assets/landing/hero-cafe.jpg'
import heroPortraitUpper from '../../assets/landing/hero-portrait-upper.png'
import heroPortrait from '../../assets/landing/hero-portrait.jpg'
import { Button } from '../../components/ui/Button/Button'
import { site } from '../../config/site'
import { topicParticle } from '../../utils/korean'
import { startQuiz } from '../quiz/quizRoute'
import styles from './HeroSection.module.css'

const AUDIENCE = '45세 이상 싱글을 위한 동반자 서비스 · 준비 중'

// 화면 폭마다 사진 배치가 달라 <picture>로 바꿔 끼웁니다.
// media 값(48rem)은 tokens.css·Tailwind의 태블릿 기준과 같아야 합니다.
const TABLET_UP = '(min-width: 48rem)'

/**
 * 랜딩 첫 화면 (Figma "Service introduction" / 데스크톱 "Hero")
 * - 모바일: 인물 사진 → 글 → 카페 사진 → 테스트 초대 카드
 * - 태블릿: 카페 사진(배지) → 글 → 인물 사진 → 카드
 * - 데스크톱: 왼쪽 글·카드 / 오른쪽 카페·인물 사진
 */
export function HeroSection() {
  return (
    // 히어로 폭은 '내용 최대 폭 + 데스크톱 양옆 여백'까지 — 아주 넓은 화면에서도 글이 다른 섹션 내용과 같은 선에서 시작
    // 데스크톱: 왼쪽 칸 2줄(제목·설명 / 질문 카드) + 오른쪽 사진 칸(두 줄에 걸침, 위·아래 사진을 같은 높이로 나눔)
    <section
      aria-labelledby="hero-title"
      className={`${styles.layout} mx-auto flex w-full max-w-(--size-hero-max-width) flex-col xl:grid`}
    >
      {/* 큰 사진 (데스크톱에서는 오른쪽 칸: 위 사진 | 띠 | 아래 사진) */}
      <div className={`${styles.media} relative overflow-hidden xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:grid`}>
        <picture className="xl:contents">
          <source media={TABLET_UP} srcSet={heroCafe} />
          {/* 데스크톱에서 h-0·min-h-full: 사진 크기가 히어로 높이를 키우지 않고, 나눠진 칸을 채움 */}
          {/* 줄 위치를 직접 지정 (<source>가 격자 칸을 차지해 순서가 밀리는 것을 막음) */}
          <img
            className={`${styles.mainPhoto} h-full xl:row-start-1 xl:h-0 xl:min-h-full`}
            src={heroPortrait}
            alt=""
          />
        </picture>
        <div className={`${styles.divider} hidden xl:row-start-2 xl:block`} />
        <img
          className={`${styles.lowerPhoto} hidden w-full xl:row-start-3 xl:block xl:h-0 xl:min-h-full`}
          src={heroPortraitUpper}
          alt=""
        />
        <div className={`${styles.fade} absolute inset-x-0 bottom-0`} aria-hidden="true" />
        <p className={`${styles.badge} absolute top-6 left-6 hidden px-3 py-1.5 md:block xl:hidden`}>{AUDIENCE}</p>
      </div>

      {/* 글과 테스트 초대 (데스크톱에서는 감싼 상자를 풀고 왼쪽 칸 1줄·2줄에 배치) */}
      <div className="flex flex-col md:gap-10 md:px-12 md:pb-14 xl:contents">
        <div className="flex flex-col gap-3 px-6 pt-5 md:gap-5 md:p-0 xl:col-start-1 xl:row-start-1 xl:pt-20 xl:pr-16 xl:pb-10 xl:pl-24">
          <p className={`${styles.audience} md:hidden xl:block`}>{AUDIENCE}</p>
          <h1 id="hero-title" className={styles.headline}>
            나와 잘 맞는 사람과
            <br />
            편안하게 커피 한 잔.
          </h1>
          <p className={styles.description}>
            {site.serviceName}
            {topicParticle(site.serviceName)} 신원과 혼인 상태를 확인한 45세 이상 싱글이{' '}
            <br className="hidden md:inline" />
            가까운 곳에서 1:1로 편안하게 만날 수 있도록 준비하고 있어요.
          </p>
        </div>

        <div className="px-6 pt-5 md:p-0 xl:hidden">
          <figure className={`${styles.secondary} relative overflow-hidden`}>
            <picture>
              <source media={TABLET_UP} srcSet={heroPortrait} />
              <img className={styles.secondaryPhoto} src={heroCafe} alt="" />
            </picture>
            <figcaption className={`${styles.caption} absolute inset-x-0 bottom-0`}>
              <span className="md:hidden">가까운 카페에서 편안한 첫 만남</span>
              <span className="hidden md:inline">같은 또래, 같은 눈높이로 만나요</span>
            </figcaption>
          </figure>
        </div>

        <div className="p-5 md:p-0 xl:col-start-1 xl:row-start-2 xl:pr-16 xl:pl-24">
          <div className={`${styles.card} flex flex-col gap-3 md:gap-6 xl:gap-5`}>
            <div className="flex flex-col gap-3 xl:gap-2.5">
              <h2 className={styles.cardTitle}>어떤 동행이 나와 잘 맞을까요?</h2>
              <p className={styles.cardDescription}>
                10가지 질문으로 내가 소중하게 여기는 관계의 모습을 알아보세요. 가입 없이 바로 시작할 수 있어요.
              </p>
            </div>
            <Button size="lg" arrow="forward" onClick={startQuiz}>
              나의 인연 유형 알아보기
            </Button>
            <p className={styles.cardNote}>10문항 · 가입 없이 결과 확인</p>
          </div>
        </div>
      </div>
    </section>
  )
}
