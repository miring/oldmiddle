import { LoveTypeChip } from '../../components/ui/LoveTypeChip/LoveTypeChip'
import { SectionHeading } from '../../components/ui/SectionHeading/SectionHeading'
import { site } from '../../config/site'
import { HomeSection } from './HomeSection'
import styles from './HomeLoveStyle.module.css'

/** 사랑하는 방식 여섯 가지 (이름 + 한마디). 점수나 잘 맞는 유형 짝은 홈에 보여 주지 않습니다 */
const LOVE_TYPES = [
  { name: '설렘형', description: '표현으로 전하는' },
  { name: '애틋형', description: '안부로 확인하는' },
  { name: '자유형', description: '내 시간도 아끼는' },
  { name: '설계형', description: '생활을 함께 살피는' },
  { name: '오랜친구형', description: '천천히 쌓아 가는' },
  { name: '헌신형', description: '기쁨을 먼저 챙기는' },
]

/**
 * 정식 홈 ④ "가입 뒤 5분 테스트" (Figma "Love style test" / "Love style")
 * 휴대폰: 머리·설명 → 칩 2열 → 안내 / 태블릿: 칩 3열 / 데스크톱: 왼쪽 글, 오른쪽 칩 3×2 (어두운 초록 배경)
 */
export function HomeLoveStyle() {
  return (
    <HomeSection id="home-love-style" labelledBy="home-love-style-title" tone="calm" toneXl="inverse">
      <div className="grid gap-4.5 xl:grid-cols-2 xl:items-center xl:gap-x-12 xl:gap-y-4">
        <div className="flex flex-col gap-4.5 xl:col-start-1 xl:row-start-1 xl:gap-4">
          <SectionHeading
            id="home-love-style-title"
            label="가입 뒤 5분 테스트"
            title={
              <>
                나는 어떻게
                <br />
                사랑하는 사람일까요?
              </>
            }
            toneXl="inverse"
          />
          <p className={styles.description}>30문항에 답하면 여섯 가지 사랑하는 방식 중 내 모습을 알려 드려요.</p>
        </div>

        <ul role="list" className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:gap-3">
          {LOVE_TYPES.map((type) => (
            <li key={type.name}>
              <LoveTypeChip name={type.name} description={type.description} />
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4.5 xl:col-start-1 xl:row-start-2 xl:gap-4">
          <p className={styles.emphasis}>결과는 소개에 조용히 더해져요.</p>
          <p className={styles.note}>
            재미로 보는 테스트예요
            {site.loveStylePreviewUrl && (
              <>
                {' · '}
                <a href={site.loveStylePreviewUrl} className={styles.link}>
                  미리 해 보기
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </HomeSection>
  )
}
