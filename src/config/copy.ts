import { topicParticle } from '../utils/korean'
import { site } from './site'

// 여러 화면에서 같은 뜻으로 쓰는 문구. 고칠 때는 여기 한 곳만 고칩니다.
export const COPY = {
  /** 사전 신청에서 받지 않는 정보 (랜딩 "부담 없는 사전 신청", 사전 신청 폼) */
  notCollected: '이름, 생년월일, 상세 주소, 사진은 묻지 않아요.',
  /** 대상 배지 (랜딩 첫 화면, 신청 폼) */
  audienceBadge: '45세 이상 전용',
  /** 결과 화면 하단 사전 신청 버튼 */
  preregisterStart: '사전 신청하기',
  /** 사전 신청 폼 제출 버튼 (항상 누를 수 있음, 누르면 검사) */
  preregisterSubmit: '신청하기',
} as const

/** 사전 신청 폼 안내·오류 문구. 오류는 무엇을 고치면 되는지 말합니다. */
export const PREREGISTER_FORM_COPY = {
  /** 신청 버튼 아래 안내 */
  optionalNote: '선택 항목은 체크하지 않아도 신청돼요',
  errors: {
    gender: '성별을 골라 주세요',
    age: '연령대를 골라 주세요',
    province: '사는 시·도를 골라 주세요',
    district: '사는 시·군·구를 골라 주세요',
    phoneEmpty: '휴대폰 번호를 입력해 주세요',
    phonePrefix: '010처럼 01로 시작하는 휴대폰 번호를 입력해 주세요',
    phoneShort: '휴대폰 번호 11자리를 입력해 주세요 (예: 010-1234-5678)',
    codeNotRequested: '[인증번호]를 눌러 문자로 받은 번호를 입력해 주세요',
    codeShort: '문자로 받은 인증번호 6자리를 입력해 주세요',
    codeNotVerified: '인증번호를 확인해 주세요',
    consent: '필수 항목에 동의해 주세요',
  },
} as const

/** 신청 전 확인 바텀시트 "이대로 신청할까요?" */
export const PREREGISTER_CONFIRM_COPY = {
  title: '이대로 신청할까요?',
  labels: {
    phone: '휴대폰 번호',
    region: '사는 지역',
    age: '연령대',
    gender: '성별',
    marketing: '혜택·이벤트 소식',
  },
  marketingYes: '받음',
  marketingNo: '받지 않음',
  notice: '서비스를 시작하면 이 번호로 카카오톡이나 문자로 알려 드려요',
  confirm: '이대로 신청하기',
  confirming: '신청하는 중…',
  edit: '고치기',
  failed: '신청하지 못했어요. 잠시 후 [이대로 신청하기]를 다시 눌러 주세요.',
  alreadyRegistered: '이미 사전 신청한 번호예요. 서비스를 시작하면 이 번호로 알려 드릴게요.',
  tooMany: '신청 시도가 많아 잠시 멈췄어요. 10분쯤 뒤에 다시 눌러 주세요.',
} as const

/** 사전 신청 취소 화면 (접수 확인 메시지의 취소 링크로 들어옴) */
export const PREREGISTER_CANCEL_COPY = {
  header: '사전 신청 취소',
  title: '사전 신청을 취소할까요?',
  body: '취소하면 남겨 주신 정보를 바로 지우고, 서비스 시작 안내도 보내지 않아요.',
  confirm: '신청 취소하기',
  confirming: '취소하는 중…',
  keep: '취소하지 않기',
  doneTitle: '사전 신청을 취소했어요',
  doneBody: '남겨 주신 정보를 모두 지웠어요. 관심 가져 주셔서 고마워요.',
  notFoundTitle: '취소할 신청을 찾지 못했어요',
  notFoundBody: '이미 취소했거나 보관 기간이 지나 정보가 지워졌을 수 있어요.',
  failed: '취소하지 못했어요. 잠시 후 다시 눌러 주세요.',
  home: '첫 화면으로',
} as const

/** 사전 신청 완료 화면 */
export const PREREGISTER_DONE_COPY = {
  header: '신청 완료',
  title: '사전 신청이 끝났어요',
  /** 제목 아래 감성 문장. 화면이 열릴 때 하나를 무작위로 골라 보여 줌 */
  warmLines: [
    '오늘 낸 한 걸음이 따뜻한 인연으로 이어지길 바라요.',
    '좋은 인연은 서두르지 않아도 제때 찾아와요.',
    '함께 걷고 싶은 길이 생기면, 하루가 조금 더 환해져요.',
    '새로운 계절처럼, 새로운 인연도 천천히 다가와요.',
    '인생의 다음 장은 생각보다 따뜻할 거예요.',
  ],
  regionCount: (region: string, count: number) => `${region}에서 ${count}명이 먼저 신청했어요`,
  regionOpen: (region: string) => `${region}에서 사전 신청을 받고 있어요`,
  /** 같은 지역 카드 안내. strong 부분만 굵게 강조 (앞 + 강조 + 뒤로 이어 붙여 한 문장) */
  notify: {
    before: '서비스를 시작하면 ',
    strong: '카카오톡이나 문자로 가장 먼저',
    after: ' 알려 드릴게요.',
  },
  /** 사전 신청 혜택. title이 비어 있으면 혜택 카드 전체를 숨깁니다 (docs/운영-준비.md "동의서 빈칸"과 함께 채움) */
  benefit: {
    badge: '사전 신청 혜택',
    title: '',
    note: '오픈 때 같은 조건으로 드려요.',
  },
  resultSummary: (myType: string, matchType: string) => `내 유형 ${myType} · 잘 맞는 유형 ${matchType}`,
  resultLink: '결과 다시 보기',
  channel: '카카오톡 채널 추가하기',
  channelNote: '선택 · 채널을 추가하면 문의도 카카오톡으로 할 수 있어요',
  /** 첫 화면의 서비스 소개 섹션으로 가는 링크 */
  aboutLink: `${site.serviceName}${topicParticle(site.serviceName)} 어떤 곳인가요?`,
  /** 서비스 소개 링크 아래 안심 문구 */
  reassurance: '전화로 연락드리거나 가입을 권하지 않아요.',
}

/**
 * 사전 신청 동의서 판(version). 아래 동의 문구를 고치면 이 값도 올립니다.
 * 저장할 때 consent_version으로 함께 남겨, 어느 문구에 동의했는지 알 수 있게 합니다.
 */
export const CONSENT_VERSION = '2026-10-v3'

/**
 * 사전 신청 동의 항목 [보기] 내용.
 * [ ]로 된 부분은 아직 정하지 않은 값입니다 (docs/운영-준비.md "동의서 빈칸").
 */
/** 휴대폰 번호와 성별·연령대·지역·테스트 유형의 보관 기간 (같은 기간이라 한 곳에서 관리) */
const PREREGISTER_RETENTION = '정식 오픈 후 6개월 또는 신청일로부터 1년 중 먼저 오는 날까지'

export const CONSENT_COPY = {
  /** 동의 행 이름 (체크박스 옆 문구) */
  labels: {
    all: '전체 동의 (선택 포함)',
    notice: '[필수] 45세 이상이며, 사전 신청 안내를 확인했어요',
    privacy: '[필수] 개인정보 수집·이용에 동의해요',
    marketing: '[선택] 혜택·이벤트 등 광고성 정보를 받을게요',
  },
  /** [보기] 펼친 내용 맨 아래 버튼: 아직 체크 전 / 이미 체크됨 */
  actions: {
    agree: '동의하고 닫기',
    close: '닫기',
  },
  /** ① (필수) 사전 신청 안내 */
  notice: [
    '사전 신청은 회원 가입이 아니며, 비용이 들지 않아요.',
    `${site.serviceName}${topicParticle(site.serviceName)} 45세 이상 싱글을 위한 서비스예요. 정식 가입 때 휴대폰 본인인증과 혼인 상태 확인이 있으며, 사실과 다르면 가입할 수 없어요.`,
    '오픈 일정과 지역은 신청 현황에 따라 정하며, 문자나 카카오톡으로 알려 드려요. 전화로 권유하지 않아요.',
    '테스트 결과는 재미로 보는 결과이며, 만남을 보장하지 않아요.',
    '사전 신청 혜택: [혜택 내용·조건]. 오픈 때 같은 조건으로 드려요.',
    '언제든 [취소 방법]으로 취소할 수 있고, 취소하면 바로 지워요.',
  ],
  /** ② (필수) 개인정보 수집·이용 — 항목별 무엇을 / 왜 / 언제까지 */
  privacy: {
    labels: { why: '왜', until: '언제까지' },
    rows: [
      {
        what: '휴대폰 번호',
        why: '오픈 소식을 알려 드리고, 중복 신청을 막기 위해',
        until: PREREGISTER_RETENTION,
      },
      {
        what: '성별, 연령대, 사는 지역(시·군·구), 테스트 유형',
        why: '어느 지역부터 문을 열지 정하는 통계를 내기 위해',
        until: PREREGISTER_RETENTION,
      },
      {
        what: '접속 기록(IP, 시간, 기기)',
        why: '장난 신청을 막기 위해',
        until: '3개월',
      },
    ],
    notes: [
      '신청을 취소하면 바로 지워요.',
      '신청 정보는 [국가]에 있는 [업체] 서버에 저장돼요.',
      '동의하지 않을 수 있지만, 그러면 사전 신청과 오픈 안내를 받을 수 없어요. 결과는 그대로 볼 수 있어요.',
    ],
  },
  /** ③ (선택) 광고성 정보 수신 */
  marketing: [
    '출시 혜택, 이벤트, 새 테스트 소식을 문자나 카카오톡으로 보내 드려요.',
    '오전 8시부터 오후 9시 사이에만 보내요.',
    '발송은 [발송 대행사]가 맡아요.',
    '동의하지 않아도 사전 신청과 오픈 안내는 그대로 받아요.',
    '언제든 무료로 그만 받을 수 있어요.',
  ],
} as const

/** 푸터 링크 (랜딩·정식 홈). 주소가 비어 있으면 SiteFooter가 그 링크를 숨깁니다 */
export const FOOTER_LINKS = [
  { label: '이용약관', href: site.termsUrl },
  { label: '개인정보 처리방침', href: site.privacyUrl },
  { label: '문의하기', href: site.contactUrl },
]
