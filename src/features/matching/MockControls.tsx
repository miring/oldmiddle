import { useId } from 'react'
import { DEFAULT_MOCK_NOW, getMockOptions, setMockOptions, type MockScenario } from '../../mocks/matches'
import { HOME_HASH, navigate } from '../quiz/quizRoute'
import { useMatchData } from './matchView'
import { endPreviewSession } from './memberSession'
import styles from './Matching.module.css'

const SCENARIOS: { value: MockScenario; label: string }[] = [
  { value: 'all', label: '모든 상태' },
  { value: 'no-matches', label: '매칭 0건' },
  { value: 'no-archive', label: '보관함 0건' },
]

/** ISO → datetime-local 입력값 (한국 시간) */
const toKstInput = (date: Date) => new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 16)

/**
 * 미리보기 설정 (더미 데이터 확인용, 실제 서비스에는 없음). 상태 묶음과 '지금 시각'을 바꿔 모든 상태를 볼 수 있습니다.
 * TODO(저장 로직): 실제 데이터로 바꿀 때 이 상자를 지웁니다.
 */
export function MockControls() {
  const id = useId()
  const { now } = useMatchData()
  const { scenario } = getMockOptions()

  return (
    <details className={`${styles.mock} mt-10 p-4`}>
      <summary className={styles.mockSummary}>미리보기 설정 (더미 데이터)</summary>
      <div className="mt-4 flex flex-col gap-4">
        <label htmlFor={`${id}-scenario`} className="flex flex-col gap-1">
          상태 묶음
          <select
            id={`${id}-scenario`}
            className={styles.mockInput}
            value={scenario}
            onChange={(event) => setMockOptions({ scenario: event.target.value as MockScenario })}
          >
            {SCENARIOS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${id}-now`} className="flex flex-col gap-1">
          지금 시각 (한국 시간)
          <input
            id={`${id}-now`}
            type="datetime-local"
            className={styles.mockInput}
            value={toKstInput(now)}
            onChange={(event) => event.target.value && setMockOptions({ now: `${event.target.value}:00+09:00` })}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={styles.mockButton} onClick={() => setMockOptions({ scenario: 'all', now: DEFAULT_MOCK_NOW })}>
            처음 상태로
          </button>
          <button
            type="button"
            className={styles.mockButton}
            onClick={() => {
              endPreviewSession()
              navigate(HOME_HASH)
            }}
          >
            로그아웃하고 홈 보기
          </button>
        </div>
      </div>
    </details>
  )
}
