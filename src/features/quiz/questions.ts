export type QuizChoice = {
  id: string
  /** 줄바꿈(\n)은 화면에서도 그대로 줄을 바꿉니다 */
  label: string
}

export type QuizQuestion = {
  id: string
  /** 줄바꿈(\n)은 화면에서도 그대로 줄을 바꿉니다 */
  text: string
  choices: QuizChoice[]
}

// 문구는 Figma "마지막사랑 · 질문01~10" 화면 기준입니다.
// 선택지 id는 결과(유형) 계산 규칙이 정해지면 그에 맞춰 다시 정합니다.
export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q01-saturday',
    text: '평범한 토요일 오후,\n가장 끌리는 모습은?',
    choices: [
      { id: 'a', label: '공원이나 둘레길을 걷는 시간' },
      { id: 'b', label: '집에서 차 한잔과 함께 조용히 쉬는 시간' },
      { id: 'c', label: '밀린 집안일을 하나씩 끝내는 시간' },
      { id: 'd', label: '전시회나 서점에서 생각에 잠기는 시간' },
    ],
  },
  {
    id: 'q02-want-to-try',
    text: '요즘 가장\n해보고 싶은 것은?',
    choices: [
      { id: 'a', label: '배워보고 싶었던 것 시작하기' },
      { id: 'b', label: '삶의 계획을 차분히 정리하기' },
      { id: 'c', label: '나를 위한 작은 사치 — 맛있는 밥, 좋은 차' },
      { id: 'd', label: '새로운 곳으로 떠나는 여행' },
    ],
  },
  {
    id: 'q03-feel-loved',
    text: '누군가에게 “사랑받고 있다”고\n느끼는 순간은?',
    choices: [
      { id: 'a', label: '말한 시간에 어김없이 나타나 줄 때' },
      { id: 'b', label: '내 이야기를 기억하고 다시 물어봐 줄 때' },
      { id: 'c', label: '“이번 주에 거기 가볼까?” 하고\n먼저 제안해 줄 때' },
      { id: 'd', label: '몸이 안 좋을 때 죽을 사다 주는 순간' },
    ],
  },
  {
    id: 'q04-good-talk',
    text: '대화가 잘 통한다고 느끼는\n상대는?',
    choices: [
      { id: 'a', label: '내 기분을 먼저 알아차리는 사람' },
      { id: 'b', label: '같은 것을 보고 같이 웃는 사람' },
      { id: 'c', label: '생각이 달라도 존중하며 이야기 나누는 사람' },
      { id: 'd', label: '말과 행동이 다르지 않은 사람' },
    ],
  },
  {
    id: 'q05-contact',
    text: '연락 빈도는 어느 정도가\n편한가요?',
    choices: [
      { id: 'a', label: '자주는 아니어도 만날 약속은 꼭 잡는 정도' },
      { id: 'b', label: '필요할 때 분명하게 연락되는 정도' },
      { id: 'c', label: '하루 한두 번, 안부를 물어봐 주는 정도' },
      { id: 'd', label: '가끔이라도 길게, 진지하게 나누는 정도' },
    ],
  },
  {
    id: 'q06-first-place',
    text: '첫 만남 장소로\n가장 마음에 드는 곳은?',
    choices: [
      { id: 'a', label: '대화하기 좋은 한적한 찻집' },
      { id: 'b', label: '조용하고 아늑한 한정식집' },
      { id: 'c', label: '교통이 편하고 시간 맞추기 좋은 곳' },
      { id: 'd', label: '강변이 보이는 산책로와 카페' },
    ],
  },
  {
    id: 'q07-next-date',
    text: '두세 번 만남 뒤,\n해보고 싶은 데이트는?',
    choices: [
      { id: 'a', label: '장보기나 일상적인 볼일 함께 하기' },
      { id: 'b', label: '근교로 당일치기 나들이' },
      { id: 'c', label: '영화나 공연을 보고 감상 나누기' },
      { id: 'd', label: '상대가 좋아하는 음식을 함께 먹기' },
    ],
  },
  {
    id: 'q08-hard-times',
    text: '힘든 일이 생겼을 때\n상대에게 바라는 것은?',
    choices: [
      { id: 'a', label: '말없이 곁에 있어 주는 것' },
      { id: 'b', label: '끝까지 이야기를 들어 주는 것' },
      { id: 'c', label: '기분 전환하러 밖으로 데려가 주는 것' },
      { id: 'd', label: '같이 해결 방법을 찾아 주는 것' },
    ],
  },
  {
    id: 'q09-lasting',
    text: '두 사람의 관계가 오래 가려면\n가장 중요한 것은?',
    choices: [
      { id: 'a', label: '함께하는 즐거운 시간' },
      { id: 'b', label: '믿음과 약속' },
      { id: 'c', label: '서로에 대한 다정한 배려' },
      { id: 'd', label: '서로를 이해하려는 대화' },
    ],
  },
  {
    id: 'q10-five-years',
    text: '5년 뒤, 누군가와 함께라면\n그리는 모습은?',
    choices: [
      { id: 'a', label: '책과 음악을 나누며 오래 이야기하는 모습' },
      { id: 'b', label: '따뜻한 저녁 식탁을 함께 차리는 모습' },
      { id: 'c', label: '서로의 생활을 든든하게 받쳐주는 모습' },
      { id: 'd', label: '배낭 하나 메고 함께 여행 다니는 모습' },
    ],
  },
]

export const QUIZ_TOTAL = QUESTIONS.length
