export type QuizChoice = {
  id: string
  label: string
}

export type QuizQuestion = {
  id: string
  /** 줄바꿈(\n)은 화면에서도 그대로 줄을 바꿉니다 */
  text: string
  choices: QuizChoice[]
}

export const QUIZ_TOTAL = 10

// 나머지 9문항은 문구 확정 후 추가합니다.
export const firstQuestion: QuizQuestion = {
  id: 'ordinary-saturday',
  text: '평범한 토요일 오후,\n가장 끌리는 모습은?',
  choices: [
    { id: 'walk', label: '공원이나 둘레길을 걷는 시간' },
    { id: 'tea', label: '집에서 차 한잔과 함께 조용히 쉬는 시간' },
    { id: 'chores', label: '밀린 집안일을 하나씩 끝내는 시간' },
    { id: 'gallery', label: '전시회나 서점에서 생각에 잠기는 시간' },
  ],
}
