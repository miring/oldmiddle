import heroDesktop540 from '../../assets/home/home-hero-desktop-540.webp'
import heroDesktop1080 from '../../assets/home/home-hero-desktop-1080.webp'
import heroMobile720 from '../../assets/home/home-hero-mobile-720.webp'
import heroMobile1440 from '../../assets/home/home-hero-mobile-1440.webp'
import doc from '../../assets/icons/doc.svg'
import lock from '../../assets/icons/lock.svg'
import shield from '../../assets/icons/shield.svg'
import { Badge } from '../../components/ui/Badge/Badge'
import { ButtonLink } from '../../components/ui/Button/Button'
import { IconListItem } from '../../components/ui/IconListItem/IconListItem'
import { TextLink } from '../../components/ui/TextLink/TextLink'
import { SIGNUP_HASH } from '../quiz/quizRoute'
import { HomeSection } from './HomeSection'
import styles from './HomeHero.module.css'

// media 값(48rem·85rem)은 tokens.css·Tailwind의 태블릿·데스크톱 기준과 같아야 합니다.
const TABLET_UP = '(min-width: 48rem)'
const DESKTOP_UP = '(min-width: 85rem)'

const TRUST = [
  { label: '본인인증', icon: shield },
  { label: '혼인 상태 서약', icon: doc },
  { label: '연락처 비공개', icon: lock },
]

/**
 * 정식 홈 첫 화면 (Figma "시연 · 정식 홈" Hero)
 * 휴대폰·태블릿: 글 → 일러스트 → 버튼 순서 / 데스크톱: 왼쪽 글·버튼, 오른쪽 일러스트
 */
export function HomeHero() {
  return (
    <HomeSection labelledBy="home-hero-title" spacing="hero">
      <div className="grid gap-5 xl:grid-cols-2 xl:items-center xl:gap-x-12 xl:gap-y-6">
        <div className="flex flex-col gap-5 xl:col-start-1 xl:row-start-1 xl:gap-6">
          <Badge tone="secondary">45세 이상 · 서울부터</Badge>
          <div className="flex flex-col gap-3">
            <h1 id="home-hero-title" className={styles.title}>
              때가 되어
              <br />
              만난 인연
            </h1>
            <p className={styles.description}>
              확인된 내 또래를, 한 달에 정해진 만큼,
              <br />
              낮 카페에서 편안하게 만나요.
            </p>
          </div>
        </div>

        {/*
          히어로 사진. 휴대폰·태블릿은 Figma 350:220, 데스크톱은 540:380 비율로 잘라 둔 webp를 화면에 맞는 크기로 받음.
          자리 높이는 토큰으로 미리 잡혀 있어 사진이 늦게 와도 화면이 밀리지 않음.
          제목·설명이 내용을 전하므로 사진은 장식(alt 비움)
        */}
        <picture className={`${styles.media} block overflow-hidden xl:col-start-2 xl:row-span-2 xl:row-start-1`}>
          <source media={DESKTOP_UP} srcSet={`${heroDesktop540} 540w, ${heroDesktop1080} 1080w`} sizes="540px" />
          <img
            className="size-full object-cover object-top"
            src={heroMobile720}
            srcSet={`${heroMobile720} 720w, ${heroMobile1440} 1440w`}
            sizes={`${TABLET_UP} 738px, 100vw`}
            width={720}
            height={453}
            alt=""
            fetchPriority="high"
          />
        </picture>

        <div className="flex flex-col gap-5 xl:col-start-1 xl:row-start-2 xl:gap-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-7">
            <div className="xl:w-60 xl:shrink-0">
              <ButtonLink href={SIGNUP_HASH}>가입하기</ButtonLink>
            </div>
            {/* 데스크톱은 버튼 옆 한 줄로 (칸이 글자에 맞춰 조금 넓어짐) */}
            <TextLink href={SIGNUP_HASH} className="self-center xl:self-auto xl:whitespace-nowrap">
              사전 신청하셨나요? 이어서 가입하기
            </TextLink>
          </div>
          <ul role="list" aria-label="안심 장치" className="flex flex-wrap justify-center gap-x-4 xl:justify-start">
            {TRUST.map((item) => (
              <li key={item.label}>
                <IconListItem size="sm" icon={item.icon}>
                  {item.label}
                </IconListItem>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </HomeSection>
  )
}
