// 랜딩 "참여 방법" 단계와 "부담 없는 사전 신청" 수집 항목. 문구는 Figma 기준입니다.

export type ParticipationStep = {
  id: string
  title: string
  description: string
  /** 선택 단계 표시 문구 (예: "원하실 때만 · 선택") */
  optionalLabel?: string
}

export const PARTICIPATION_STEPS: ParticipationStep[] = [
  { id: 'answer', title: '10가지 질문에 답해요', description: '일상 속 작은 선택으로 내가 바라는 동행을 돌아봐요.' },
  { id: 'result', title: '내 타입을 바로 확인해요', description: '가입 없이 나의 타입과 설명을 볼 수 있어요.' },
  {
    id: 'preregister',
    title: '사전 신청으로 이어가요',
    description: '나와 잘 맞는 타입을 알아보고, 서비스 시작 소식을 받아요.',
    optionalLabel: '원하실 때만 · 선택',
  },
]

/** 사전 신청에서 받을 정보 (사업계획서: 성별·연령대·구 단위 지역·휴대폰 번호 4가지만) */
export const PREREGISTRATION_FIELDS = ['성별', '연령대', '사는 지역(구 단위)', '휴대폰 번호']
