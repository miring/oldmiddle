import { FOOTER_BUSINESS, FOOTER_LINK_ITEMS, type BusinessInfo } from '../../../config/footerContent'
import { site } from '../../../config/site'
import { TextLink } from '../TextLink/TextLink'
import styles from './SiteFooter.module.css'

/** 비어 있는 값은 빼고, 보여 줄 사업자 정보 줄만 만듭니다 */
function businessLines(business: BusinessInfo) {
  const owner = [
    business.companyName && `상호 ${business.companyName}`,
    business.representative && `대표 ${business.representative}`,
  ]
    .filter(Boolean)
    .join(' · ')
  return [
    owner,
    business.registrationNumber && `사업자등록번호 ${business.registrationNumber}`,
    business.mailOrderNumber && `통신판매업 신고번호 ${business.mailOrderNumber}`,
    business.address && `주소 ${business.address}`,
    business.phone && `연락처 ${business.phone}`,
  ].filter((line): line is string => Boolean(line))
}

/**
 * 화면 맨 아래 정보형 푸터 (랜딩·정식 홈 공통, Figma 홈 "Footer").
 * 휴대폰·태블릿: 1열 / 데스크톱: 서비스명·뜻풀이 | 사업자 정보 | 링크 3단.
 * 사업자 정보·링크는 src/config/footerContent.ts 값 중 비어 있지 않은 것만 보입니다.
 */
export function SiteFooter() {
  const lines = businessLines(FOOTER_BUSINESS)
  const visibleLinks = FOOTER_LINK_ITEMS.filter((link) => link.href)

  return (
    <footer className={`${styles.footer} content-gutter pt-9 pb-12 xl:pt-12 xl:pb-14`}>
      <div className="grid gap-3.5 xl:grid-cols-3 xl:gap-12">
        <div className="flex flex-col gap-2">
          <p className={styles.brand}>{site.serviceName}</p>
          {/* Figma 휴대폰 푸터에는 뜻풀이가 없어 데스크톱에서만 */}
          <p className={`${styles.note} hidden xl:block`}>{site.tagline}</p>
        </div>
        {lines.length > 0 && (
          <ul role="list" className={styles.info}>
            {lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
        {visibleLinks.length > 0 && (
          <ul role="list" className="flex flex-wrap gap-x-4.5 xl:col-start-3 xl:flex-col xl:items-start">
            {visibleLinks.map((link) => (
              <li key={link.label}>
                <TextLink href={link.href} className={`${styles.link} ${link.strong ? styles.linkStrong : ''}`}>
                  {link.label}
                </TextLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  )
}
