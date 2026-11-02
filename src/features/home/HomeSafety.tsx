import alert from '../../assets/icons/alert.svg'
import badge from '../../assets/icons/badge.svg'
import clock from '../../assets/icons/clock.svg'
import doc from '../../assets/icons/doc.svg'
import lock from '../../assets/icons/lock.svg'
import video from '../../assets/icons/video.svg'
import { IconListItem } from '../../components/ui/IconListItem/IconListItem'
import { SectionHeading } from '../../components/ui/SectionHeading/SectionHeading'
import { HomeSection } from './HomeSection'

/** 독신 확인 배지는 선택 제출이라 '원하는 분만'을 문구에 둡니다 */
const SAFETY_ITEMS = [
  { title: '혼인 상태 서약', icon: doc, body: '거짓이 드러나면 영구 정지돼요.' },
  { title: '독신 확인 배지', icon: badge, body: '원하는 분만 증명서를 내요. 확인한 달을 함께 보여 드려요.' },
  { title: '첫 만남 전 영상 통화', icon: video, body: '운영자와 10분, 실물과 진지함을 확인해요.' },
  { title: '연락처 비공개', icon: lock, body: '만나기 전에는 서비스 안에서만 이야기해요.' },
  { title: '돈 이야기 차단', icon: alert, body: '송금·투자 같은 말은 보내기 전에 막아요.' },
  { title: '신고 24시간 응답', icon: clock, body: '운영자가 직접 확인해요.' },
]

/**
 * 정식 홈 ⑤ "안심 장치" (Figma "Safety" / "Trust")
 * 휴대폰 1열 / 태블릿 2열 / 데스크톱 3열 × 2줄. 항목 높이는 내용에 맞춤
 */
export function HomeSafety() {
  return (
    <HomeSection id="home-safety" labelledBy="home-safety-title">
      <div className="flex flex-col gap-4 md:gap-8">
        <SectionHeading id="home-safety-title" label="안심 장치" title="믿을 수 있어야 마음이 열리니까요" />
        <ul role="list" className="grid items-start gap-4 md:grid-cols-2 md:gap-x-10 md:gap-y-7 xl:grid-cols-3">
          {SAFETY_ITEMS.map((item) => (
            <li key={item.title}>
              <IconListItem icon={item.icon} title={item.title}>
                {item.body}
              </IconListItem>
            </li>
          ))}
        </ul>
      </div>
    </HomeSection>
  )
}
