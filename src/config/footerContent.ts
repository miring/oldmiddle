import { HOME_HASH } from '../features/quiz/quizRoute'
import { FOOTER_LINKS } from './copy'
import { site } from './site'

export type BusinessInfo = {
  companyName: string
  representative: string
  registrationNumber: string
  marriageAgencyNumber: string
  mailOrderNumber: string
}

export type FooterLink = {
  label: string
  href: string
  /** 굵게 (개인정보 처리방침은 다른 링크와 구분되게) */
  strong?: boolean
}

/*
 * 푸터(랜딩·정식 홈 공통)에 보여 줄 사업자 정보와 링크.
 * 실제 값은 site.ts(사업자 정보·주소)와 copy.ts(링크 이름)에 있고, 비어 있는 항목은 SiteFooter가 숨깁니다.
 * 개발 서버와 외부 미리보기(VITE_HOME_PREVIEW=true)에서만 빈칸을 디자인 확인용 예시 값으로 채웁니다.
 * 운영 빌드에서는 SHOW_EXAMPLES가 false로 정해져 예시 값이 빌드 결과에서 빠집니다.
 */
const SHOW_EXAMPLES = import.meta.env.DEV || import.meta.env.VITE_HOME_PREVIEW === 'true'

const EXAMPLE_BUSINESS: BusinessInfo = {
  companyName: '(예시) 시연',
  representative: '(예시) 홍길동',
  registrationNumber: '(예시) 000-00-00000',
  marriageAgencyNumber: '(예시) 신고 후 표시',
  mailOrderNumber: '(예시) 결제 시작 후 표시',
}

/** 비어 있는 항목만 예시 값으로 채웁니다 */
function withExampleBusiness(business: BusinessInfo): BusinessInfo {
  return {
    companyName: business.companyName || EXAMPLE_BUSINESS.companyName,
    representative: business.representative || EXAMPLE_BUSINESS.representative,
    registrationNumber: business.registrationNumber || EXAMPLE_BUSINESS.registrationNumber,
    marriageAgencyNumber: business.marriageAgencyNumber || EXAMPLE_BUSINESS.marriageAgencyNumber,
    mailOrderNumber: business.mailOrderNumber || EXAMPLE_BUSINESS.mailOrderNumber,
  }
}

/** 주소가 비어 있는 링크는 홈 주소로 채워 모양만 보이게 합니다 */
function withExampleLinks(links: FooterLink[]): FooterLink[] {
  return links.map((link) => ({ ...link, href: link.href || HOME_HASH }))
}

export const FOOTER_BUSINESS: BusinessInfo = SHOW_EXAMPLES ? withExampleBusiness(site.business) : site.business
export const FOOTER_LINK_ITEMS: FooterLink[] = SHOW_EXAMPLES ? withExampleLinks(FOOTER_LINKS) : FOOTER_LINKS
