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

type SiteFooterProps = {
  /** 로고 옆 한 줄 (예: "천천히, 준비하고 있어요.") */
  note?: string
  /** 사업자 정보. 비어 있는 항목은 그 줄을 숨깁니다 */
  business?: BusinessInfo
  /** 이용약관·개인정보 처리방침·문의하기 등. 주소가 비어 있으면 그 링크를 숨깁니다 */
  links?: { label: string; href: string }[]
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
export function SiteFooter({ note, business, links = [] }: SiteFooterProps) {
  const lines = business ? businessLines(business) : []
  const visibleLinks = links.filter((link) => link.href)

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
