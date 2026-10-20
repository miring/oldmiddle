import heroCafe from '../../assets/landing/hero-cafe.jpg'
import heroPortraitUpper from '../../assets/landing/hero-portrait-upper.png'
import heroPortrait from '../../assets/landing/hero-portrait.jpg'
import { Button } from '../../components/ui/Button/Button'
import { site } from '../../config/site'
import { topicParticle } from '../../utils/korean'
import { goToStep } from '../quiz/quizRoute'
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
    <section aria-labelledby="hero-title" className="flex flex-col xl:min-h-(--size-hero-min-height) xl:flex-row">
      {/* 큰 사진 (데스크톱에서는 오른쪽 칸) */}
      <div className={`${styles.media} relative overflow-hidden xl:order-last xl:flex xl:flex-1 xl:flex-col`}>
        <picture>
          <source media={TABLET_UP} srcSet={heroCafe} />
          <img className={styles.mainPhoto} src={heroPortrait} alt="" />
        </picture>
        <div className={`${styles.divider} hidden xl:block`} />
        <img className={`${styles.lowerPhoto} hidden xl:block`} src={heroPortraitUpper} alt="" />
        <div className={`${styles.fade} absolute inset-x-0 bottom-0`} aria-hidden="true" />
        <p className={`${styles.badge} absolute top-6 left-6 hidden px-3 py-1.5 md:block xl:hidden`}>{AUDIENCE}</p>
      </div>

      {/* 글과 테스트 초대 */}
      <div className="flex flex-col md:gap-10 md:px-12 md:pb-14 xl:w-(--size-hero-left-width) xl:shrink-0 xl:justify-center xl:py-20 xl:pr-16 xl:pl-24">
        <div className="flex flex-col gap-3 px-6 pt-5 md:gap-5 md:p-0">
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

        <div className="p-5 md:p-0">
          <div className={`${styles.card} flex flex-col gap-3 md:gap-6 xl:gap-5`}>
            <div className="flex flex-col gap-3 xl:gap-2.5">
              <h2 className={styles.cardTitle}>어떤 동행이 나에게 어울릴까요?</h2>
              <p className={styles.cardDescription}>
                10가지 질문으로 내가 소중하게 여기는 관계의 모습을 알아보세요. 가입 없이 바로 시작할 수 있어요.
              </p>
            </div>
            <Button size="lg" arrow="forward" onClick={() => goToStep(1)}>
              나의 인연 유형 알아보기
            </Button>
            <p className={styles.cardNote}>10문항 · 가입 없이 결과 확인</p>
          </div>
        </div>
      </div>
    </section>
  )
}
