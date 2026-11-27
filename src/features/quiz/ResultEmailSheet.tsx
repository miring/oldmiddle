import { useState } from 'react'
import { Button } from '../../components/ui/Button/Button'
import { TextField } from '../../components/ui/TextField/TextField'
import { isValidEmail } from '../preregister/preregisterOptions'
import { PreregisterError, sendResultMail } from '../preregister/submitPreregistration'
import type { CompanionResult } from './results'
import styles from './ResultEmailSheet.module.css'

const ERRORS: Record<string, string> = {
  too_many_requests: '오늘은 더 보낼 수 없어요. 내일 다시 시도해 주세요.',
  invalid_input: '메일 주소를 확인해 주세요.',
}

/**
 * 결과 화면 [내 메일로 결과 받기] 바텀시트 안 내용: 받을 내용 + 내 메일 주소 + [메일 보내기]
 * 시연이 결과 메일을 보내고(result-mail 함수), 보내면 onSent(첫 화면으로 이동)를 부릅니다.
 * 메일 주소는 서버에 저장하지 않습니다.
 */
export function ResultEmailSheet({
  result,
  onSent,
  onClose,
}: {
  result: CompanionResult
  onSent: () => void
  onClose: () => void
}) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!isValidEmail(email)) {
      setError('메일 주소를 확인해 주세요.')
      return
    }
    setError(null)
    setSending(true)
    try {
      await sendResultMail(email, result.type)
      onSent()
    } catch (e) {
      const code = e instanceof PreregisterError ? e.code : ''
      setError(ERRORS[code] ?? '메일을 보내지 못했어요. 잠시 뒤 다시 시도해 주세요.')
      setSending(false)
    }
  }

  return (
    <>
      <div className={`${styles.preview} flex flex-col gap-2 p-5`}>
        <p className={styles.label}>받을 내용</p>
        <p className={styles.subject}>{result.name}</p>
        <p className={styles.body}>{result.tagline.replaceAll('\n', ' ')}</p>
        <p className={styles.link}>잘 맞는 인연 · 첫 만남 팁 · 테스트 링크</p>
      </div>
      <TextField
        label="내 메일 주소"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="예: hong@naver.com"
        value={email}
        onChange={(value) => {
          setEmail(value)
          if (error) setError(null)
        }}
        error={error}
        hint="결과를 보내는 데만 쓰고 저장하지 않아요. 받은 메일은 지인에게 전달할 수 있어요."
      />
      <div className="flex flex-col gap-3 pb-7">
        <Button onClick={handleSend} disabled={sending}>
          {sending ? '보내는 중…' : '메일 보내기'}
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={sending}>
          닫기
        </Button>
      </div>
    </>
  )
}
