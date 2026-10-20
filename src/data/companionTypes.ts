import characterA from '../assets/characters/character-a.png'
import characterB from '../assets/characters/character-b.png'
import characterC from '../assets/characters/character-c.png'
import characterD from '../assets/characters/character-d.png'

export type CompanionType = 'A' | 'B' | 'C' | 'D'

export type CompanionTypeInfo = {
  type: CompanionType
  name: string
  /** 한 줄 소개 */
  summary: string
  /** 캐릭터 일러스트 */
  image: string
}

/**
 * 동행 유형 4가지. 랜딩 "네 가지 마음"과 테스트 결과 화면이 함께 씁니다.
 * 문구는 Figma "Four ways of being together"·"결과 A~D" 기준입니다.
 */
export const COMPANION_TYPES: CompanionTypeInfo[] = [
  { type: 'A', name: '따뜻한 안식처형', summary: '말보다 꼼꼼한 챙김으로 사랑을 느끼는 사람', image: characterA },
  { type: 'B', name: '함께 걷는 친구형', summary: '같이 걷고, 먹고, 여행하며 가까워지는 사람', image: characterB },
  { type: 'C', name: '깊은 대화형', summary: '서로의 생각과 인생 이야기를 나누며 가까워지는 사람', image: characterC },
  {
    type: 'D',
    name: '든든한 생활동반자형',
    summary: '약속을 지키고 일상을 함께 꾸려가는 것에서 안정을 느끼는 사람',
    image: characterD,
  },
]

export function getCompanionType(type: CompanionType): CompanionTypeInfo {
  return COMPANION_TYPES.find((info) => info.type === type)!
}
