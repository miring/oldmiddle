import badgeCheck from '../../assets/icons/badge-check.svg'
import coffee from '../../assets/icons/coffee.svg'
import lockKeyhole from '../../assets/icons/lock-keyhole.svg'

export type ServicePrinciple = {
  id: string
  /** 장식용 아이콘 (의미는 제목·설명 글로 전달) */
  icon: string
  title: string
  description: string
}

// 랜딩 "마지막사랑이 준비하는 만남" 항목. 문구는 Figma "Trust principles" 기준입니다.
export const SERVICE_PRINCIPLES: ServicePrinciple[] = [
  {
    id: 'verification',
    icon: badgeCheck,
    title: '서로를 확인하는 첫 단계',
    description: '신원과 배우자 유무 확인, 짧은 영상 인터뷰를 거치는 절차를 준비하고 있어요.',
  },
  {
    id: 'private-profile',
    icon: lockKeyhole,
    title: '프로필은 필요한 분에게만',
    description: '누구나 둘러보는 공개 목록 대신, 연결된 상대에게만 프로필을 보여드릴 예정이에요.',
  },
  {
    id: 'cafe-one-on-one',
    icon: coffee,
    title: '가까운 카페에서, 일대일로',
    description: '단체 모임이나 끝없는 채팅 대신, 가까운 공개 카페에서 만나도록 시간과 장소 조율을 도울 예정이에요.',
  },
]
