import { useId, useState } from 'react'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { DEFAULT_MOCK_NOW, endMatchByPartner, getMockOptions, setMockOptions, type MockScenario } from '../../mocks/matches'
import { HOME_HASH } from '../quiz/quizRoute'
import { matchPhase } from './diaryRules'
import { partnerName, useMatchData } from './matchView'
import { endPreviewSession } from './memberSession'
import styles from './Matching.module.css'

const c = MATCHING_COPY.mock
const SCENARIOS: MockScenario[] = ['all', 'no-matches', 'no-archive']

/** ISO → datetime-local 입력값 (한국 시간) */
const toKstInput = (date: Date) => new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 16)

/**
 * 미리보기 설정 (더미 데이터 확인용, 실제 서비스에는 없음). 상태 묶음과 '지금 시각'을 바꿔 모든 상태를 볼 수 있습니다.
 * 의향 확인 중인 매칭을 상대가 '이번엔 여기까지'로 끝낸 상태로 바꿔 볼 수 있습니다.
 * 로그인 전·후 정식 홈 헤더를 탭을 닫지 않고 비교할 수 있게 '미리보기 로그아웃'과 '정식 홈 보기'를 둡니다.
 * TODO(저장 로직): 실제 데이터로 바꿀 때 이 상자를 지웁니다.
 */
export function MockControls() {
  const id = useId()
  const { matches, now } = useMatchData()
  const { scenario } = getMockOptions()
  const [loggedOut, setLoggedOut] = useState(false)
  const deciding = matches.filter((match) => matchPhase(match, now) === 'decide')
  const [endTarget, setEndTarget] = useState('')
  const endId = deciding.some((match) => match.id === endTarget) ? endTarget : deciding[0]?.id

  return (
    <details className={`${styles.mock} mt-10 p-4`}>
      <summary className={styles.mockSummary}>{c.summary}</summary>
      <div className="mt-4 flex flex-col gap-4">
        <label htmlFor={`${id}-scenario`} className="flex flex-col gap-1">
          {c.scenario}
          <select
            id={`${id}-scenario`}
            className={styles.mockInput}
            value={scenario}
            onChange={(event) => setMockOptions({ scenario: event.target.value as MockScenario })}
          >
            {SCENARIOS.map((value) => (
              <option key={value} value={value}>
                {c.scenarios[value]}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${id}-now`} className="flex flex-col gap-1">
          {c.now}
          <input
            id={`${id}-now`}
            type="datetime-local"
            className={styles.mockInput}
            value={toKstInput(now)}
            onChange={(event) => event.target.value && setMockOptions({ now: `${event.target.value}:00+09:00` })}
          />
        </label>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${id}-end`}>{c.partnerEndsTarget}</label>
          <div className="flex flex-wrap gap-2">
            <select
              id={`${id}-end`}
              className={styles.mockInput}
              value={endId ?? ''}
              disabled={!endId}
              onChange={(event) => setEndTarget(event.target.value)}
            >
              {deciding.length === 0 && <option value="">{c.partnerEndsNone}</option>}
              {deciding.map((match) => (
                <option key={match.id} value={match.id}>
                  {partnerName(match)}
                </option>
              ))}
            </select>
            <button type="button" className={styles.mockButton} disabled={!endId} onClick={() => endId && endMatchByPartner(endId)}>
              {c.partnerEnds}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={styles.mockButton} onClick={() => setMockOptions({ scenario: 'all', now: DEFAULT_MOCK_NOW })}>
            {c.reset}
          </button>
          <button
            type="button"
            className={styles.mockButton}
            onClick={() => {
              endPreviewSession()
              setLoggedOut(true)
            }}
          >
            {c.logout}
          </button>
          <a href={HOME_HASH} className={`${styles.mockButton} inline-flex items-center`}>
            {c.home}
          </a>
        </div>
        <p role="status">{loggedOut ? c.loggedOut : ''}</p>
      </div>
    </details>
  )
}
