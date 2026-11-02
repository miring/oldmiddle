import { site } from '../../../config/site'
import { Brand } from '../Brand/Brand'
import { TextLink } from '../TextLink/TextLink'
import styles from './SiteFooter.module.css'

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
  /** 굵게 (개인정보 처리방침은 다른 링크와 구분되게) — 진한 푸터에서만 */
  strong?: boolean
}

type SiteFooterProps = {
  /** 로고 옆 한 줄 (예: "천천히, 준비하고 있어요.") */
  note?: string
  /** 사업자 정보. 비어 있는 항목은 그 줄을 숨깁니다 */
  business?: BusinessInfo
  /** 이용약관·개인정보 처리방침·문의하기 등. 주소가 비어 있으면 그 링크를 숨깁니다 */
  links?: FooterLink[]
  /** default: 옅은 노랑 바탕 (랜딩) / dark: 진한 바탕, 데스크톱 3단 (정식 홈) */
  tone?: 'default' | 'dark'
}

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
    business.marriageAgencyNumber && `결혼중개업 신고번호 ${business.marriageAgencyNumber}`,
    business.mailOrderNumber && `통신판매업 신고 ${business.mailOrderNumber}`,
  ].filter((line): line is string => Boolean(line))
}

/** 화면 맨 아래 정보형 푸터: 로고·한 줄 + 사업자 정보 + 약관 링크 (랜딩·정식 홈) */
export function SiteFooter({ note, business, links = [], tone = 'default' }: SiteFooterProps) {
  const lines = business ? businessLines(business) : []
  const visibleLinks = links.filter((link) => link.href)

  if (tone === 'dark') {
    return (
      <footer className={`${styles.dark} content-gutter pt-9 pb-12 xl:pt-12 xl:pb-14`}>
        {/* 휴대폰·태블릿: 1열 / 데스크톱: 서비스명·뜻풀이 | 사업자 정보 | 링크 3단 */}
        <div className="grid gap-3.5 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-2">
            <p className={styles.darkBrand}>{site.serviceName}</p>
            {/* Figma 휴대폰 푸터에는 뜻풀이가 없어 데스크톱에서만 */}
            {note && <p className={`${styles.darkNote} hidden xl:block`}>{note}</p>}
          </div>
          {lines.length > 0 && (
            <ul role="list" className={styles.darkInfo}>
              {lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
          {visibleLinks.length > 0 && (
            <ul role="list" className="flex flex-wrap gap-x-4.5 xl:col-start-3 xl:flex-col xl:items-start">
              {visibleLinks.map((link) => (
                <li key={link.label}>
                  <TextLink href={link.href} className={`${styles.darkLink} ${link.strong ? styles.darkLinkStrong : ''}`}>
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

  return (
    <footer className={`${styles.footer} content-gutter`}>
      <div className="flex flex-col gap-4.5 pb-7 md:gap-0 md:pb-0">
        <hr className={styles.rule} />
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 md:py-8">
          <Brand />
          {note && <p className={styles.note}>{note}</p>}
        </div>
        {(lines.length > 0 || visibleLinks.length > 0) && (
          <div className="flex flex-col gap-2 md:pb-8">
            {lines.length > 0 && (
              <ul role="list" className={styles.info}>
                {lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
            {visibleLinks.length > 0 && (
              <ul role="list" className="flex flex-wrap gap-x-4.5">
                {visibleLinks.map((link) => (
                  <li key={link.label}>
                    <TextLink href={link.href}>{link.label}</TextLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </footer>
  )
}
