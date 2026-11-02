import type { BusinessInfo, FooterLink } from '../components/ui/SiteFooter/SiteFooter'
import { HOME_HASH } from '../features/quiz/quizRoute'

/*
 * 정식 홈 푸터의 디자인 확인용 예시 값. 개발 서버와 외부 미리보기(VITE_HOME_PREVIEW=true)에서만 씁니다.
 * 운영 빌드에서는 SHOW_FOOTER_EXAMPLES가 false로 정해져 이 값들이 빌드 결과에서 빠집니다.
 * 실제 값(site.ts)이 있는 항목은 실제 값을 그대로 보여 줍니다.
 */

const EXAMPLE_BUSINESS: BusinessInfo = {
  companyName: '(예시) 시연',
  representative: '(예시) 홍길동',
  registrationNumber: '(예시) 000-00-00000',
  marriageAgencyNumber: '(예시) 신고 후 표시',
  mailOrderNumber: '(예시) 결제 시작 후 표시',
}

/** 비어 있는 항목만 예시 값으로 채웁니다 */
export function withExampleBusiness(business: BusinessInfo): BusinessInfo {
  return {
    companyName: business.companyName || EXAMPLE_BUSINESS.companyName,
    representative: business.representative || EXAMPLE_BUSINESS.representative,
    registrationNumber: business.registrationNumber || EXAMPLE_BUSINESS.registrationNumber,
    marriageAgencyNumber: business.marriageAgencyNumber || EXAMPLE_BUSINESS.marriageAgencyNumber,
    mailOrderNumber: business.mailOrderNumber || EXAMPLE_BUSINESS.mailOrderNumber,
  }
}

/** 주소가 비어 있는 링크는 홈 주소로 채워 모양만 보이게 합니다 (눌러도 홈에 머묾) */
export function withExampleLinks(links: FooterLink[]): FooterLink[] {
  return links.map((link) => ({ ...link, href: link.href || HOME_HASH }))
}
