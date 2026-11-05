import { site } from './site'
/**
 * 회원 앱 '나의 매칭'(교환일기) 문구 (Figma '내정보' 페이지). 상대 이름·날짜가 들어가는 문구는 화면에서 이어 붙입니다.
 * 화면 이름은 '나의 매칭'으로 통일합니다. 회원 앱과 함께 미리보기 환경에서만 불러오도록 copy.ts와 따로 둡니다.
 */
export const MATCHING_COPY = {
  title: '나의 매칭',
  intro: '교환일기를 3번 주고받으면 만날 시간을 고를 수 있어요.',
  /** closed: 마무리된 매칭(기한 만료·'이번엔 여기까지'). 목록 맨 아래에 정해진 날 수만 남습니다 */
  sections: { diary: '교환일기 중', decide: '의향 확인', meeting: '만남 약속', closed: '마무리된 인연' },
  archiveLink: '교환일기 보관함',
  /** 매칭 0건일 때 이 문구만 보여 줍니다 */
  empty: '매칭 이력이 없습니다.',
  status: {
    arrived: '편지가 도착했어요',
    myTurn: '내 답을 기다려요',
    waiting: '상대 답을 기다려요',
    opening: '내일 아침 8시에 열려요',
    decide: '마음을 정해 주세요',
    /** 내가 먼저 고르고 상대를 기다릴 때 (카드 배지·의향 확인 화면 공통) */
    decided: '마음 확인중',
    pickTime: '만날 시간을 골라 주세요',
    closed: '여기까지예요',
  },
  progress: { meeting: '약속 확정', pickTime: '약속 잡기', allLetters: '편지 3통' },
  deliveryNotice: '편지는 쓴 다음 날 아침 8시에 상대에게 도착해요. 두 분이 모두 답하면 함께 열려요.',
  allShared: '세 번의 편지를 모두 나눴어요',
  /**
   * 마무리된 매칭 화면의 안내와 [홈으로]. 기한 만료와 '이번엔 여기까지' 모두 같은 문구입니다 (누가 골랐는지 알리지 않음, 기획서 7장).
   * 목록에 남아 있는 동안은 closedRemoval을 이어 붙입니다. 보관함에는 넣지 않습니다
   */
  closedNotice: '이번 인연은 여기까지예요',
  /** 로고와 같은 회원 첫 화면(MEMBER_HOME_HASH)으로 */
  /** 마무리된 매칭 화면에서 안내 뒤에 이어 붙입니다. 날짜는 '11월 5일' */
  closedRemoval: (date: string) => `이 매칭은 ${date}에 목록에서 사라져요.`,
  closedHome: '홈으로',
  metNotice: '주고받은 편지는 교환일기 보관함에 남아 있어요.',
  pickTimeNotice: "만날 시간은 '약속'에서 고를 수 있어요.",
  reportLink: '신고하기',
  locked: {
    together: '두 분이 모두 답하면 함께 열려요',
    arrivedBody: '내 답을 쓰면 다음 날 아침 8시에 함께 열려요',
    myTurnTitle: '오늘의 질문이 기다리고 있어요',
    openingTitle: '내일 아침 8시에 함께 열려요',
    openingBody: '두 분 모두 답을 보냈어요',
  },
  write: {
    title: '편지 쓰기',
    action: '답 쓰기',
    answerLabel: '답',
    extraLabel: '한 줄 더 (선택)',
    extraPlaceholder: '하고 싶은 말을 한 줄 남겨 주세요',
    attachPhoto: '풍경 사진 1장 (선택)',
    attachVoice: '목소리로 답하기 (선택)',
    attachPreparing: '사진·목소리 답하기는 준비 중이에요.',
    blockedNotice: '전화번호·카카오톡 ID·계좌번호와 돈 이야기는 보낼 수 없어요.',
    submit: '편지 보내기',
  },
  decide: {
    action: '마음 정하기',
    body: '나눈 이야기를 떠올리며 천천히 정해 주세요.',
    yes: '만나보고 싶어요',
    no: '이번엔 여기까지',
    notice: "두 분 모두 '만나보고 싶어요'를 고르면 만날 시간을 고를 수 있어요. '이번엔 여기까지'를 고르셔도 상대에게 따로 알리지 않아요.",
    waiting: "'만나보고 싶어요'를 골랐어요. 상대도 고르면 만날 시간을 고를 수 있어요.",
  },
  archive: {
    intro: '만난 뒤에도 주고받은 편지를 다시 볼 수 있어요.',
    empty: '아직 보관된 교환일기가 없어요. 첫 만남을 마치면 여기에 남아요.',
  },
  report: {
    title: '신고하기',
    whoLabel: '누구를 신고할까요?',
    reasonLabel: '어떤 일이 있었나요?',
    reasons: ['기혼자로 의심돼요', '돈 이야기나 투자를 권해요', '연락처나 만남을 재촉해요', '불쾌한 말을 했어요', '사진과 다른 분 같아요', '그 밖의 이유'],
    notice: '신고한 사실은 상대에게 알리지 않아요. 24시간 안에 운영자가 직접 확인해요.',
    submit: '신고 보내기',
    done: '신고를 받았어요. 24시간 안에 운영자가 직접 확인하고 알려 드릴게요.',
    preview: '(미리보기 화면이라 실제로 보내지는 않아요)',
  },
  tabs: { today: '오늘의 추천', matches: '나의 매칭', meetings: '약속', me: '내 정보' },
  preparing: '준비 중이에요',
  /** 로그아웃 (데스크톱 헤더 메뉴 끝·내 정보 맨 아래). 화면 안 확인 창을 한 번 띄웁니다 */
  signOut: { action: '로그아웃', title: '로그아웃할까요?', confirm: '로그아웃', cancel: '취소' },
  /**
   * '오늘의 추천' 탭 (기획서 7장 횟수제 매칭·쌍방 체크·한 줄 편지, 9장 인연이 오는 날).
   * 시각·이름이 들어가는 문구는 함수로 둡니다. '마음에 담기'는 어떤 문구로도 상대에게 알리지 않습니다
   */
  today: {
    title: '오늘의 추천',
    monthLeft: (left: number, total: number) => `이번 달 남은 추천 ${left}명 (월 ${total}명)`,
    /** '11월 5일(목) 저녁 8시' */
    revealTime: (day: string) => `${day} 저녁 8시`,
    deadline: (time: string) => `${time}까지 답해 주세요`,
    hoursLeft: (hours: number) => `${hours}시간 남았어요`,
    minutesLeft: (minutes: number) => `${minutes}분 남았어요`,
    card: {
      photos: '사진',
      photoAlt: (index: number) => `사진 ${index}`,
      intro: '자기소개',
      hobbies: '하고 싶은 취미',
      values: '가치관 질문',
      purpose: '만남 목적',
      voice: '음성 자기소개',
      voicePlay: '목소리 듣기',
      same: '나와 같아요',
      single: (month: string) => `독신 확인 · ${month}`,
    },
    actions: {
      letter: '만나보고 싶어요',
      keep: '마음에 담기',
      keepNote: '상대에게 알리지 않아요.',
      keepFull: (max: number) => `담은 분이 ${max}명이에요. 목록에서 한 분을 빼면 더 담을 수 있어요.`,
      pass: '다음에요',
      passNote: '고르시면 이 분은 6개월 동안 다시 추천하지 않아요.',
    },
    letter: {
      title: '한 줄 편지',
      lead: (name: string) => `${name}에게 한 줄 편지와 함께 '만나보고 싶어요'를 보내요.`,
      label: '한 줄 편지 (선택)',
      examplesTitle: '이렇게 써 보세요',
      examples: ['산책 좋아하신다는 말에 눈이 갔어요.', '사진 찍는 취미가 같아서 반가웠어요.', '천천히 이야기 나눠 보고 싶어요.'],
      useExample: (example: string) => `'${example}' 넣기`,
      blockedNotice: '전화번호·카카오톡 ID·계좌번호와 돈 이야기는 보낼 수 없어요.',
      submit: '보내기',
    },
    result: {
      letterTitle: '답을 기다려요',
      letterBody: '7일 안에 답이 없으면 추천 횟수를 돌려드려요.',
      sentLetter: '보낸 한 줄 편지',
      keepTitle: '마음에 담아 두었어요',
      keepBody: '상대에게는 알리지 않아요. 상대도 담으면 바로 알려 드려요.',
      passTitle: '다음에요를 골랐어요',
      passBody: '이 분은 6개월 동안 다시 추천하지 않아요.',
    },
    empty: {
      before: '다음 추천을 기다려요',
      roundEnded: '이번 회차 추천이 끝났어요',
      roundEndedBody: '답하지 않은 추천은 횟수에서 빼지 않았어요.',
      next: (time: string) => `다음 추천은 ${time}에 도착해요.`,
      monthUsed: '이번 달 추천을 모두 받았어요',
      monthUsedBody: (day: string) => `${day}에 다시 채워져요.`,
    },
    kept: {
      link: (count: number, max: number) => `마음에 담은 분 ${count}/${max}`,
      title: '마음에 담은 분',
      intro: (max: number) => `나만 볼 수 있어요. 최대 ${max}명까지 담을 수 있고, 상대도 담으면 알려 드려요.`,
      empty: '아직 담은 분이 없어요.',
      until: (day: string) => `${day}까지 담아 둬요`,
      remove: '빼기',
      removeLabel: (name: string) => `${name} 빼기`,
    },
    mutual: {
      banner: '서로 마음에 담은 분이 있어요',
      open: '확인하기',
      title: '서로 마음에 담은 분이 있어요',
      body: (name: string) => `${name}도 나를 마음에 담았어요. 만나 보시겠어요?`,
      confirm: '만나볼게요',
      note: '누르면 나의 매칭에서 교환일기가 시작돼요. 기한이 지나면 이 안내는 사라져요.',
    },
  },
  /**
   * '내 정보' 탭 (기획서 7장 프로필, 8장 독신 확인, 9장 알림, 10장 요금). 아직 못 하는 일은 버튼만 두고 누르면 '준비 중이에요'.
   * 금액·횟수도 여기 둡니다 (정식 홈 요금 섹션은 copy.ts HOME_PRICING_COPY)
   */
  myInfo: {
    title: '내 정보',
    /** 맨 위 회원 이름 */
    greeting: (name: string) => `${name}님`,
    edit: '고치기',
    preparing: '준비 중이에요',
    profile: {
      title: '내 프로필',
      photos: '사진',
      photoStatus: { public: '공개 중', reviewing: '확인 중' },
      photoAlt: (index: number) => `내 사진 ${index}`,
      photoNote: '사진을 바꾸면 한 번 더 살펴본 뒤 보여 드려요.',
      intro: '자기소개',
      hobbies: '하고 싶은 취미',
      values: '가치관 질문',
      /** 기획서 7장 '가치관 질문 5개' */
      valueQuestions: ['주말은 어떻게 보내세요?', '건강은 어떻게 챙기세요?', '가족과는 어떻게 지내세요?', '어떤 관계를 바라세요?', '돈은 어떻게 쓰는 편이세요?'],
      purpose: '만남 목적',
      loveType: '사랑하는 방식',
      loveTypeNote: '나만 볼 수 있어요',
    },
    single: {
      title: '독신 확인',
      verified: (month: string) => `독신 확인 · ${month}`,
      verifiedNote: '확인한 달이 프로필에 함께 보여요.',
      none: '미제출',
      noneBody: "혼인관계증명서를 내시면 프로필에 '독신 확인' 배지가 붙어요. 내지 않아도 이용할 수 있어요.",
      noneRules: ['일반증명서만 받아요', '발급한 지 3개월 안의 증명서만 받아요'],
      submit: '증명서 내기',
    },
    availability: {
      title: '만날 수 있는 때',
      note: '약속을 잡을 때 이 요일과 시간대로 먼저 시간 후보를 보여 드려요.',
      days: { mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일' },
      daysLegend: '요일',
      bands: { late_morning: '오전 늦게 (11~13시)', afternoon: '오후 (13~18시)' },
      bandsLegend: '시간대',
      dayLabel: (day: string) => `${day}요일`,
      needOne: '요일과 시간대를 하나 이상 골라 주세요.',
      save: '저장하기',
    },
    preferences: {
      title: '소개받는 조건',
      intro: '이 조건에 맞는 분에게만 내가 추천돼요.',
      age: '나이',
      ageRange: (min: number, max: number) => `${min}~${max}세`,
      smoking: '흡연',
      smokingOptions: { 'non-smoker': '피우지 않는 분', any: '상관없어요' },
      verifiedOnly: '독신 확인된 분만 소개받기',
    },
    on: '켜짐',
    off: '꺼짐',
    plan: {
      title: '이용권',
      plans: {
        basic: { name: '베이직', price: '월 29,000원', recommend: 4, meetings: 1 },
        standard: { name: '스탠다드', price: '월 49,000원', recommend: 8, meetings: 2 },
      },
      left: '이번 달 남은 횟수',
      recommendLeft: (left: number, total: number) => `추천 ${left}명 (월 ${total}명)`,
      meetingLeft: (left: number, total: number) => `약속\u00a0잡기 ${left}회 (월 ${total}회)`,
      nextBilling: '다음 결제일',
      sendLink: '결제 링크 보내기',
      sendLinkNote: '결제 링크를 문자로 받아 다른 휴대폰에서도 결제할 수 있어요.',
      refund: '환불 규정',
      refundNote: '쓰지 않은 횟수는 날짜만큼 계산해 돌려드려요.',
      cancel: '해지하기',
    },
    pause: {
      title: '휴회',
      body: '잠시 쉬고 싶을 때 프로필을 숨기고 추천을 멈춰요.',
      price: '월 3,000원 · 최대 6개월',
      action: '휴회하기',
    },
    notify: {
      title: '알림',
      dayOnly: "'인연이 오는 날' 알림만 받기",
      dayOnlyNote: '켜면 추천이 도착하는 날 알림과 약속 안내만 보내 드려요.',
    },
    leave: '탈퇴하기',
    /** 맨 아래 서비스 안내 (회원 화면에는 푸터가 없어 약관·처리방침·문의를 여기에). 링크 이름·주소는 푸터와 같은 값 */
    serviceInfo: { title: '서비스 안내', about: `${site.serviceName} 소개` },
  },
  /** 미리보기 설정 (더미 데이터 확인용, 실제 서비스에는 없음) */
  mock: {
    summary: '미리보기 설정 (더미 데이터)',
    scenario: '상태 묶음',
    scenarios: { all: '모든 상태', 'no-matches': '매칭 0건', 'no-archive': '보관함 0건' },
    now: '지금 시각 (한국 시간)',
    reset: '처음 상태로',
    logout: '미리보기 로그아웃',
    loggedOut: '로그아웃했어요. 정식 홈 헤더가 로그인 전 모습으로 보여요. 회원 화면을 다시 열면 다시 로그인돼요.',
    home: '정식 홈 보기',
    single: '독신 확인',
    singleOptions: { verified: '확인됨', none: '미제출' },
    today: '오늘의 추천',
    todayOpen: '추천 도착 직후로',
    todayLastHour: '응답 기한 1시간 전으로',
    todayEnded: '이번 회차 끝난 뒤로',
    todayMutual: '서로 마음에 담은 분 만들기',
    todayMonthUsed: '이번 달 추천 모두 쓰기',
    partnerEnds: "상대가 '이번엔 여기까지' 고르기",
    partnerEndsTarget: '의향 확인 중인 매칭',
    partnerEndsNone: '의향 확인 중인 매칭이 없어요',
  },
} as const
