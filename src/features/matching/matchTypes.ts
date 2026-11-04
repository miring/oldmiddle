/*
 * 나의 매칭(교환일기) 데이터 모양. 더미 데이터(src/mocks/matches.ts)와 나중에 붙일 저장 로직이 같은 모양을 씁니다.
 * '답 공개 여부'·'매칭 단계'는 저장하지 않고 diaryRules.ts에서 그때그때 계산합니다 (기획서 7장 개발 참고).
 */

export type Member = {
  id: string
  /** 본인 이름. 헤더의 '{이름}님'에만 씁니다 */
  name: string
}

/** 상대는 성(姓)·나이대·구 단위까지만 압니다 (기획서 8장 여성 우선 안전 원칙) */
export type Partner = {
  familyName: string
  ageBand: string
  district: string
}

export type DiaryQuestion = {
  text: string
  /** 의향 확인 화면의 요약 한 줄 (예: '좋아하는 산책길') */
  short: string
}

export type DiaryEntry = {
  /** 몇 번째 편지인지 (1~3) */
  round: number
  author: 'me' | 'partner'
  answer: string
  /** 한 줄 더 (선택) */
  extra?: string
  /** 쓴 시각 (ISO, 시간대 포함). 상대에게는 다음 날 아침 8시에 전달됩니다 */
  writtenAt: string
}

export type Decision = 'yes' | 'no'

export type Match = {
  id: string
  partner: Partner
  /** 교환일기를 시작한 시각. 여기서 7일이 지나면 조용히 마무리됩니다 */
  startedAt: string
  /** 세 번의 편지 질문 */
  questions: DiaryQuestion[]
  entries: DiaryEntry[]
  myDecision?: Decision
  /** 상대의 의향. 화면에 그대로 보여 주지 않고 단계 계산에만 씁니다 */
  partnerDecision?: Decision
  /**
   * 마무리된 시각. 한쪽이 '이번엔 여기까지'를 고른 시각, 또는 7일 기한.
   * 기한 만료는 비어 있으면 기한으로 계산합니다. TODO(저장 로직): 서버 예약 작업이 기한에 채웁니다
   */
  endedAt?: string
  /** 약속이 정해졌을 때만 */
  meeting?: { at: string; place: string }
}
