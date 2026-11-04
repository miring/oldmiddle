import { useRef } from 'react'
import { BottomSheet } from '../../components/ui/BottomSheet/BottomSheet'
import { useBottomSheet } from '../../components/ui/BottomSheet/useBottomSheet'
import { Button } from '../../components/ui/Button/Button'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { HOME_HASH, navigate } from '../quiz/quizRoute'
import { endPreviewSession } from './memberSession'
import styles from './Matching.module.css'

const c = MATCHING_COPY.signOut

/**
 * 로그아웃 버튼 + 화면 안 확인 창 ("로그아웃할까요?" [로그아웃] [취소]). 브라우저 confirm은 쓰지 않습니다.
 * 확인하면 더미 로그인을 풀고 정식 홈으로 갑니다. 정식 홈 헤더는 다시 그려질 때 로그인 상태를 읽어 새로고침 없이 바뀝니다.
 * nav: 데스크톱 헤더 메뉴 끝 (메뉴보다 옅은 글자) / outline: 내 정보 맨 아래 버튼
 * TODO(로그인): 실제 로그인(토큰 기반, 기획서 13장)을 붙이면 실제 세션도 끊습니다 (memberSession.ts)
 */
export function SignOutButton({ variant }: { variant: 'nav' | 'outline' }) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  // 취소로 닫으면 누른 버튼으로 포커스를 돌려줍니다
  const sheet = useBottomSheet({ onClose: () => buttonRef.current?.focus() })

  const confirm = () =>
    sheet.close({
      then: () => {
        endPreviewSession()
        navigate(HOME_HASH)
      },
    })

  return (
    <>
      {variant === 'nav' ? (
        <button ref={buttonRef} type="button" className={`${styles.navSignOut} flex items-center px-4`} onClick={sheet.show}>
          {c.action}
        </button>
      ) : (
        <Button ref={buttonRef} variant="outline" onClick={sheet.show}>
          {c.action}
        </Button>
      )}
      <BottomSheet open={sheet.open} onRequestClose={() => sheet.close()} title={c.title}>
        <div className="flex flex-col gap-3">
          <Button onClick={confirm}>{c.confirm}</Button>
          <Button variant="secondary" onClick={() => sheet.close()}>
            {c.cancel}
          </Button>
        </div>
      </BottomSheet>
    </>
  )
}
