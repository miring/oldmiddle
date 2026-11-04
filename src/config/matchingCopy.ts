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
  /** '내 정보' 탭. 누르면 정식 홈으로 */
  logout: '로그아웃',
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
    partnerEnds: "상대가 '이번엔 여기까지' 고르기",
    partnerEndsTarget: '의향 확인 중인 매칭',
    partnerEndsNone: '의향 확인 중인 매칭이 없어요',
  },
} as const
