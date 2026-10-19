import teaMusic from '../../assets/landing/choice-tea-music.svg'
import umbrellaWalk from '../../assets/landing/choice-umbrella-walk.svg'

export type QuizChoice = {
  id: string
  label: string
  illustration: string
}

export type QuizQuestion = {
  id: string
  text: string
  choices: QuizChoice[]
}

export const QUIZ_TOTAL = 10

// 나머지 9문항은 문구 확정 후 추가합니다.
export const firstQuestion: QuizQuestion = {
  id: 'rainy-sunday',
  text: '비 오는 일요일 오후, 나는?',
  choices: [
    { id: 'umbrella-walk', label: '우산 쓰고 산책', illustration: umbrellaWalk },
    { id: 'tea-music', label: '집에서 차 한 잔과 음악', illustration: teaMusic },
  ],
}
