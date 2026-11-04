import styles from './TabBar.module.css'

type TabBarProps = {
  items: { label: string; href: string; icon: string; current: boolean }[]
}

/** 휴대폰·태블릿 하단 탭 4개 (Figma Nav/TabBar). 쓰는 쪽에서 본문 아래에 --size-tab-bar-height만큼 여백을 둡니다 */
export function TabBar({ items }: TabBarProps) {
  return (
    <nav aria-label="회원 메뉴" className={`${styles.bar} fixed inset-x-0 bottom-0 z-(--z-header)`}>
      <ul role="list" className="content-gutter flex h-full items-center justify-between">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={`${styles.tab} ${item.current ? styles.current : ''} flex flex-col items-center gap-1 px-2`}
            >
              <img className={styles.icon} src={item.icon} alt="" aria-hidden="true" />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
