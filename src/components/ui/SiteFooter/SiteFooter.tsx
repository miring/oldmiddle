import { Brand } from '../Brand/Brand'
import { TextLink } from '../TextLink/TextLink'
import styles from './SiteFooter.module.css'

type SiteFooterProps = {
  /** 로고 옆 한 줄 (예: "천천히, 준비하고 있어요.") */
  note?: string
  /** 사업자 정보 줄 (정식 홈: 상호·대표, 사업자등록번호, 결혼중개업 신고번호, 통신판매업 신고) */
  businessInfo?: string[]
  /** 이용약관·개인정보 처리방침·문의하기 등 */
  links?: { label: string; href: string }[]
}

/** 화면 맨 아래 푸터. 랜딩은 로고 + 한 줄, 정식 홈은 사업자 정보와 약관 링크까지 보여 줍니다. */
export function SiteFooter({ note, businessInfo, links }: SiteFooterProps) {
  return (
    <footer className={`${styles.footer} content-gutter`}>
      <div className="flex flex-col gap-4.5 pb-7 md:gap-0 md:pb-0">
        <hr className={styles.rule} />
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 md:py-8">
          <Brand />
          {note && <p className={styles.note}>{note}</p>}
        </div>
        {(businessInfo || links) && (
          <div className="flex flex-col gap-2 md:pb-8">
            {businessInfo && (
              <ul role="list" className={styles.info}>
                {businessInfo.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
            {links && (
              <ul role="list" className="flex flex-wrap gap-x-4.5">
                {links.map((link) => (
                  <li key={link.href}>
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
