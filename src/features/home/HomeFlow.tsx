import check from '../../assets/icons/check.svg'
import clock from '../../assets/icons/clock.svg'
import lock from '../../assets/icons/lock.svg'
import { SectionHeading } from '../../components/ui/SectionHeading/SectionHeading'
import { StepList, type Step } from '../../components/ui/StepList/StepList'
import { HomeSection } from './HomeSection'
import styles from './HomeFlow.module.css'
import { LetterCard } from './LetterCard'

const DIARY_NOTE = '교환일기에서 마무리돼도 추천권과 만남 횟수는 줄지 않아요.'

const STEPS: Step[] = [
  { id: 'signup', title: '가입하기', description: '본인인증과 혼인 상태 서약. 증명서는 원하는 분만 내요.' },
  { id: 'profile', title: '프로필 쓰기', description: '최근 사진, 가치관 질문 5개, 사랑하는 방식 테스트' },
  { id: 'intro', title: '인연이 오는 날', description: '화·금 저녁 8시 소개 도착. 서로 수락하면 매칭돼요.' },
  {
    id: 'diary',
    title: '교환일기 세 번',
    description: '하루 한 질문, 7일 안에. 이 사이 10분 영상 통화도 마쳐요.',
    highlight: true,
    detail: (
      <LetterCard
        title="첫 번째 편지"
        date="11.04"
        questions={['요즘 가장 좋아하는 산책길은?']}
        notes={['답은 다음 날 아침 8시에 도착해요.', '두 분 다 써야 서로 보여요.']}
      />
    ),
  },
  { id: 'meet', title: '낮 카페에서 첫 만남', description: '시간·장소를 고르면 확정, 알림톡으로 안내해요.' },
]

const GUIDES = [
  { icon: clock, text: '답은 다음 날 아침 8시에 도착해요' },
  { icon: lock, text: '두 분 다 써야 서로 보여요' },
  { icon: check, text: DIARY_NOTE },
]

/**
 * 정식 홈 ③ "이용 흐름" (Figma "Flow")
 * 휴대폰·태블릿: 세로 타임라인, 4단계 안에 작은 편지 + 아래 안내 상자
 * 데스크톱: 가로 5칸 + 아래에 큰 편지와 안내 목록
 */
export function HomeFlow() {
  return (
    <HomeSection id="home-flow" labelledBy="home-flow-title">
      <div className="flex flex-col gap-5 md:gap-8">
        <SectionHeading
          id="home-flow-title"
          label="이용 흐름"
          title="만나기 전에, 글로 먼저"
          description="가입부터 만남까지, 천천히 서로를 알아가는 흐름을 정리했어요."
        />
        <StepList steps={STEPS} />

        <div className="hidden xl:flex xl:items-start xl:gap-6">
          <div className="min-w-0 flex-1">
            <LetterCard
              title="만나기 전에, 편지 세 통"
              date="11.04"
              questions={['① 요즘 가장 좋아하는 산책길은?', '② 쉬는 날 하루는 어떻게 보내세요?', '③ 함께 가 보고 싶은 곳이 있다면?']}
            />
          </div>
          <ul role="list" className="flex min-w-0 flex-1 flex-col gap-3.5">
            {GUIDES.map((guide) => (
              <li key={guide.text} className="flex items-center gap-3">
                <img className={`${styles.guideIcon} shrink-0`} src={guide.icon} alt="" />
                <p className={styles.guide}>{guide.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className={`${styles.note} px-4 py-3.5 xl:hidden`}>{DIARY_NOTE}</p>
      </div>
    </HomeSection>
  )
}
