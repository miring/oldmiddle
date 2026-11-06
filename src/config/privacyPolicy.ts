import { CONSENT_COPY } from './copy'
import { site } from './site'

/**
 * 개인정보 처리방침 (사전 신청 단계, 개인정보 보호법 제30조).
 * 수집 항목·목적·보관 기간은 사전 신청 동의서(CONSENT_COPY.privacy)를 그대로 가져와 두 문서가 어긋나지 않게 합니다.
 * [ ]로 된 부분은 아직 정하지 않은 값입니다 (docs/운영-준비.md "개인정보 처리방침 빈칸").
 * 정식 회원가입을 시작할 때 회원 정보·사진·결제 항목을 더해 새 판으로 고칩니다.
 */

/** 사업자 정보가 비어 있으면 [ ]로 보여 줍니다 */
const fill = (value: string, placeholder: string) => value || `[${placeholder}]`

export type PrivacySection = {
  id: string
  title: string
  paragraphs?: readonly string[]
  /** 항목별 카드 (무엇을 / 왜 / 언제까지) */
  rows?: readonly { what: string; why: string; until: string }[]
  bullets?: readonly string[]
}

export const PRIVACY_POLICY = {
  title: '개인정보 처리방침',
  /** 시행일. 내용을 고치면 바꾸고, 바뀐 내용을 7일 전에 알립니다 */
  effectiveDate: '2026년 [ ]월 [ ]일',
  intro: `${site.serviceName}(이하 '시연')은 사전 신청에 꼭 필요한 정보만 받고, 받은 정보를 어떻게 쓰고 언제 지우는지 이 방침으로 알려 드려요.`,
  /** 맨 위 한눈에 보기 */
  summary: [
    '휴대폰 번호와 성별·연령대·지역·테스트 유형만 받아요.',
    '다른 회사에 팔거나 넘기지 않아요.',
    '신청을 취소하면 바로 지워요.',
  ],
  sections: [
    {
      id: 'collect',
      title: '1. 받는 정보와 쓰는 곳, 보관 기간',
      rows: [
        ...CONSENT_COPY.privacy.rows,
        {
          what: '광고성 정보 수신 동의 여부 (선택)',
          why: '동의하신 분께만 혜택·이벤트 소식을 보내기 위해',
          until: '동의를 철회하거나 신청을 취소할 때까지',
        },
      ],
      bullets: [
        '사전 신청 화면에서 동의를 받은 뒤 받아요. 45세 이상만 신청할 수 있어 14세 미만 아동의 정보는 받지 않아요.',
        "'사랑하는 방식' 테스트 답은 이용하시는 브라우저에만 잠시 남고, 탭을 닫으면 사라져요. 사전 신청을 하실 때만 결과 유형이 함께 저장돼요.",
      ],
    },
    {
      id: 'destroy',
      title: '2. 정보를 지우는 방법',
      bullets: [
        '신청을 취소하면 그 자리에서 바로 지워요.',
        '보관 기간이 지난 정보는 매일 새벽 자동으로 지워요.',
        '지운 정보는 다시 살릴 수 없는 방법으로 지워요.',
      ],
    },
    {
      id: 'third-party',
      title: '3. 다른 곳에 주는 경우',
      paragraphs: ['받은 정보를 다른 회사나 사람에게 주지 않아요. 법에 따라 수사기관 등이 정해진 절차로 요청할 때만 예외로 해요.'],
    },
    {
      id: 'outsourcing',
      title: '4. 일을 맡기는 곳 (처리 위탁)',
      paragraphs: ['서비스 운영을 위해 아래 업체에 일을 맡기고, 계약으로 정보를 안전하게 다루도록 관리해요.'],
      rows: [
        { what: '[서버 업체]', why: '신청 정보 저장', until: '위탁 계약이 끝날 때까지' },
        { what: '[문자 발송 대행사]', why: '인증번호와 오픈 안내 문자·카카오톡 발송', until: '위탁 계약이 끝날 때까지' },
      ],
    },
    {
      id: 'overseas',
      title: '5. 해외에 보관하는 경우',
      // 서버가 국내 지역이면 이 섹션을 지웁니다 (개인정보 보호법 제28조의8)
      paragraphs: ['신청 정보는 [국가]에 있는 [서버 업체] 서버에 보관돼요. 신청할 때 인터넷으로 옮겨지며, 보관 기간은 1번과 같아요. 해외 보관을 원하지 않으시면 신청하지 않으시거나 취소하실 수 있어요.'],
    },
    {
      id: 'rights',
      title: '6. 내 정보에 대한 권리',
      bullets: [
        '언제든 내 정보를 보거나, 고치거나, 지워 달라고 하실 수 있어요.',
        '신청 취소는 접수 확인 문자 속 취소 링크로 바로 하실 수 있어요.',
        '아래 연락처로 말씀하시면 10일 안에 처리해 드려요.',
      ],
    },
    {
      id: 'security',
      title: '7. 정보를 지키는 방법',
      bullets: [
        '휴대폰 번호는 암호화해 저장해요.',
        '신청 정보는 운영자만 볼 수 있게 접근을 막아 두었어요.',
        '같은 번호·같은 곳에서 반복 신청하는 것을 막아요.',
      ],
    },
    {
      id: 'cookies',
      title: '8. 쿠키 사용',
      paragraphs: ['쿠키나 광고 추적 도구를 쓰지 않아요.'],
    },
    {
      id: 'officer',
      title: '9. 개인정보 보호책임자',
      bullets: [
        `이름: ${fill(site.business.representative, '이름')} (대표)`,
        `연락처: ${fill(site.business.phone, '전화번호')}`,
        '이메일: [이메일]',
      ],
    },
    {
      id: 'help',
      title: '10. 도움받을 수 있는 곳',
      paragraphs: ['개인정보 침해로 도움이 필요하시면 아래 기관에 문의하실 수 있어요.'],
      bullets: [
        '개인정보침해 신고센터: 국번 없이 118 (privacy.kisa.or.kr)',
        '개인정보 분쟁조정위원회: 1833-6972 (www.kopico.go.kr)',
        '대검찰청: 국번 없이 1301 (www.spo.go.kr)',
        '경찰청: 국번 없이 182 (ecrm.police.go.kr)',
      ],
    },
    {
      id: 'changes',
      title: '11. 방침이 바뀔 때',
      paragraphs: ['내용이 바뀌면 시행 7일 전에 이 화면으로 알려 드려요.'],
    },
  ] satisfies readonly PrivacySection[],
} as const
