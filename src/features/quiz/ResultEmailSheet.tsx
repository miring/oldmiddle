import { useState } from 'react'
import { Button } from '../../components/ui/Button/Button'
import { TextField } from '../../components/ui/TextField/TextField'
import { isValidEmail } from '../preregister/preregisterOptions'
import type { CompanionResult } from './results'
import { gmailComposeUrl, resultShareContent } from './shareResult'
import styles from './ResultEmailSheet.module.css'

/**
 * 결과 화면 [이메일로 공유하기] 바텀시트 안 내용: 보낼 내용 미리보기 + 받는 분 메일 + [메일 보내기]
 * 메일은 시연 서버가 보내지 않고, 사용자 본인 지메일 쓰기 창을 내용을 채워 엽니다 (스팸·광고 규정 부담 없음).
 * 받는 분 메일 주소는 저장하지 않습니다 (지메일 주소창으로만 넘김).
 */
export function ResultEmailSheet({ result, onClose }: { result: CompanionResult; onClose: () => void }) {
  const content = resultShareContent(result)
  const [to, setTo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // 사파리는 클릭 직후가 아니면 새 창을 막아서, 복사와 새 창 열기를 await 없이 바로 실행
  const copy = () => navigator.clipboard?.writeText(content.body).then(() => true, () => false) ?? Promise.resolve(false)

  const handleSend = () => {
    if (!isValidEmail(to)) {
      setError('받는 분 메일 주소를 확인해 주세요.')
      return
    }
    setError(null)
    const copying = copy()
    window.open(gmailComposeUrl(to.trim(), content.subject, content.body), '_blank', 'noopener')
    void copying.then((copied) =>
      setMessage(
        copied
          ? '지메일 쓰기 창을 열었어요. 네이버·다음 메일을 쓰시면 복사된 내용을 붙여 넣어 보내 주세요.'
          : '지메일 쓰기 창을 열었어요. 네이버·다음 메일을 쓰시면 위 내용을 그대로 적어 보내 주세요.',
      ),
    )
  }

  const handleCopy = async () => {
    setMessage((await copy()) ? '내용을 복사했어요. 쓰시는 메일에 붙여 넣어 보내 주세요.' : '이 브라우저에서는 복사가 되지 않아요.')
  }

  return (
    <>
      <div className={`${styles.preview} flex flex-col gap-2 p-5`}>
        <p className={styles.label}>보낼 내용</p>
        <p className={styles.subject}>{content.subject}</p>
        <p className={styles.body}>{content.text}</p>
        <p className={styles.link}>{content.url}</p>
      </div>
      <TextField
        label="받는 분 메일 주소"
        type="email"
        inputMode="email"
        autoComplete="off"
        placeholder="예: friend@naver.com"
        value={to}
        onChange={(value) => {
          setTo(value)
          if (error) setError(null)
        }}
        error={error}
      />
      <p className={styles.notice} aria-live="polite">
        {message ?? '[메일 보내기]를 누르면 지메일 쓰기 창이 열려요. 내 메일 계정으로 보내져요.'}
      </p>
      <div className="flex flex-col gap-3 pb-7">
        <Button onClick={handleSend}>메일 보내기</Button>
        <Button variant="secondary" onClick={handleCopy}>
          내용 복사하기
        </Button>
        <Button variant="outline" onClick={onClose}>
          닫기
        </Button>
      </div>
    </>
  )
}
