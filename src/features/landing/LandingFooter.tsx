import { SiteFooter } from '../../components/ui/SiteFooter/SiteFooter'
import { FOOTER_LINKS } from '../../config/copy'
import { site } from '../../config/site'

/** 랜딩 맨 아래 정보형 푸터. 사업자 정보·링크는 src/config/site.ts 값이 있는 것만 보입니다 */
export function LandingFooter() {
  return <SiteFooter note="천천히, 준비하고 있어요." business={site.business} links={FOOTER_LINKS} />
}
