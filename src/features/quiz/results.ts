import { getCompanionType, type CompanionType } from '../../data/companionTypes'
import { QUESTIONS } from './questions'
import type { QuizAnswers } from './quizAnswers'

export type { CompanionType }

export type CompanionResult = {
  type: CompanionType
  name: string
  /** 핵심 가치 (이름 아래 알약) */
  value: string
  /** 그림 아래 한 줄 설명. 줄바꿈(\n)은 그대로 표시합니다 */
  tagline: string
  description: string
  match: { type: CompanionType; reason: string }
  tip: string
  image: string
}

// 문구는 Figma "마지막사랑 · 결과 A~D" 화면 기준입니다.
export const RESULTS: Record<CompanionType, CompanionResult> = {
  A: {
    type: 'A',
    name: getCompanionType('A').name,
    value: '정서적 안정·배려',
    tagline: '말보다 꼼꼼한 챙김으로\n사랑을 느끼는 사람',
    description:
      '당신은 사람을 편안하게 해주는 힘이 있는 분입니다. 크고 화려한 이벤트보다 “밥은 먹었어요?” 한마디에서 사랑을 느끼죠.',
    match: { type: 'D', reason: '당신의 다정함을 안정감으로 돌려주는 사람' },
    tip: '챙겨주기보다 나에 대해 하나씩 이야기해 보세요. 받는 것도 관계의 일부예요.',
    image: getCompanionType('A').image,
  },
  B: {
    type: 'B',
    name: getCompanionType('B').name,
    value: '활동·경험 공유',
    tagline: '같이 걷고, 먹고, 여행하며\n가까워지는 사람',
    description: '당신에게 사랑은 ‘같이 본 풍경’입니다. 함께 걷고 웃는 시간이 쌓일수록 마음이 열리는 분이에요.',
    match: { type: 'C', reason: '함께한 경험에 의미와 이야기를 더해주는 사람' },
    tip: '앉아서만 대화하기보다 짧은 산책을 제안해 보세요. 자연스러운 당신이 나옵니다.',
    image: getCompanionType('B').image,
  },
  C: {
    type: 'C',
    name: getCompanionType('C').name,
    value: '공감·정신적 교감',
    tagline: '서로의 생각과 인생 이야기를 나누며\n가까워지는 사람',
    description:
      '당신은 사람의 마음 속 이야기에 귀 기울이는 분입니다. 오래 나눈 한 번의 대화가 여러 번의 만남보다 소중하죠.',
    match: { type: 'B', reason: '생각에 머물기 쉬운 당신을\n세상 밖으로 이끄는 사람' },
    tip: '상대를 바로 판단하기보다 두세 번은 만나 보세요. 깊은 사람은 천천히 보여요.',
    image: getCompanionType('C').image,
  },
  D: {
    type: 'D',
    name: getCompanionType('D').name,
    value: '신뢰·현실적 협력',
    tagline: '약속을 지키고\n일상을 함께 꾸려가는 것에서\n안정을 느끼는 사람',
    description: '당신에게 사랑은 ‘믿을 수 있는 일상’입니다. 말보다 행동으로 진심을 보여주는 사람에게 마음이 갑니다.',
    match: { type: 'A', reason: '당신의 일상에 온기를 더해주는 사람' },
    tip: '조건을 확인하는 질문보다 “요즘 뭐가 즐거우세요?”로 시작해 보세요.',
    image: getCompanionType('D').image,
  },
}

/**
 * 결과 유형 계산 (임시 규칙 — 확정 필요)
 * - 고른 선택지의 유형을 세어 가장 많은 유형이 결과입니다.
 * - 개수가 같으면, 그중 더 뒤쪽 문항에서 고른 유형을 결과로 합니다.
 * - 10문항을 모두 답하지 않았으면 null
 */
export function calculateResult(answers: QuizAnswers): CompanionType | null {
  const counts: Record<CompanionType, number> = { A: 0, B: 0, C: 0, D: 0 }
  const lastSeen: Record<CompanionType, number> = { A: -1, B: -1, C: -1, D: -1 }

  for (const [index, question] of QUESTIONS.entries()) {
    const choice = question.choices.find((c) => c.id === answers[question.id])
    if (!choice) return null
    counts[choice.type] += 1
    lastSeen[choice.type] = index
  }

  const types = Object.keys(counts) as CompanionType[]
  return types.reduce((best, type) =>
    counts[type] > counts[best] || (counts[type] === counts[best] && lastSeen[type] > lastSeen[best]) ? type : best,
  )
}
