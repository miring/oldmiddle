import { useState } from 'react'
import { Button } from '../../components/ui/Button/Button'
import { MATCHING_COPY } from '../../config/matchingCopy'
import own from './MyInfo.module.css'

/**
 * 아직 못 하는 일의 버튼 (내 정보·오늘의 추천 공통). 누르면 바로 아래에 '준비 중이에요'를 보여 주고 화면 읽기 프로그램에도 알립니다.
 * button: 초록 테두리 버튼(56px) / text: 덜 눈에 띄는 글자 버튼 (해지·탈퇴처럼 자주 누르지 않는 일)
 */
export function PreparingButton({ label, variant = 'button' }: { label: string; variant?: 'button' | 'text' }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="flex flex-col items-start gap-1">
      {variant === 'button' ? (
        <Button variant="outline" size="compact" onClick={() => setShown(true)}>
          {label}
        </Button>
      ) : (
        <button type="button" className={`${own.textButton} flex items-center`} onClick={() => setShown(true)}>
          {label}
        </button>
      )}
      <p role="status" className={own.note}>
        {shown ? MATCHING_COPY.myInfo.preparing : ''}
      </p>
    </div>
  )
}
