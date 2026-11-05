import calendar from '../../assets/icons/calendar.svg'
import mail from '../../assets/icons/mail.svg'
import shield from '../../assets/icons/shield.svg'
import users from '../../assets/icons/users.svg'
import { FeatureCard } from '../../components/ui/FeatureCard/FeatureCard'
import { SectionHeading } from '../../components/ui/SectionHeading/SectionHeading'
import { HOME_COUNT_COPY } from '../../config/copy'
import { site } from '../../config/site'
import { topicParticle } from '../../utils/korean'
import { HomeSection } from './HomeSection'

const FEATURES = [
  { title: '내 또래만', icon: users, body: '45세 이상만 가입해요. 비슷한 나이대끼리 추천해요.' },
  {
    title: '확인된 분만',
    icon: shield,
    body: '본인인증과 혼인 상태 서약으로 가입하고, 사진은 한 번 더 살펴본 뒤 보여 드려요.',
  },
  { title: '한 달에 정해진 만큼', icon: calendar, body: HOME_COUNT_COPY.monthlyCard },
  { title: '글로 먼저 알아가요', icon: mail, body: '교환일기를 세 번 주고받고, 두 분 다 원하면 낮 카페 약속이 정해져요.' },
]

/**
 * 정식 홈 ② "시연은 이런 곳이에요" (Figma "What is 시연" / "Service overview")
 * 카드: 휴대폰 1열 / 태블릿 2열 × 2줄 / 데스크톱 4열. 같은 줄의 카드는 높이를 맞춤
 */
export function HomeAbout() {
  return (
    <HomeSection labelledBy="home-about-title" tone="accent" toneXl="raised">
      <div className="flex flex-col gap-4 md:gap-8">
        <SectionHeading
          id="home-about-title"
          label={`${site.serviceName}${topicParticle(site.serviceName)} 이런 곳이에요`}
          title={
            // 좁은 화면에서 '내'만 윗줄에 남지 않도록 '내 또래와'를 함께 넘김
            <>
              천천히, 확실하게, <span className="whitespace-nowrap">내 또래와</span>
            </>
          }
          description="가입 전 확인 절차와, 글로 먼저 알아가는 과정을 통해 편안한 만남을 준비해요."
        />
        <ul role="list" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <FeatureCard icon={feature.icon} title={feature.title}>
                {feature.body}
              </FeatureCard>
            </li>
          ))}
        </ul>
      </div>
    </HomeSection>
  )
}
