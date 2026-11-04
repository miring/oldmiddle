import { useId, useState, type FormEvent } from 'react'
import clock from '../../assets/icons/clock.svg'
import { Button } from '../../components/ui/Button/Button'
import { Checkbox } from '../../components/ui/Checkbox/Checkbox'
import { Notice } from '../../components/ui/Diary/Notice'
import { FieldMessage } from '../../components/ui/FieldMessage/FieldMessage'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { saveAvailability } from '../../mocks/myInfo'
import { goBackTo } from '../quiz/quizRoute'
import { TAB_HASH } from './appRoute'
import { AppScreen } from './AppScreen'
import { BAND_KEYS, DAY_KEYS, type BandKey, type DayKey } from './myInfoTypes'
import { useMyInfo } from './myInfoView'
import styles from './Matching.module.css'
import own from './MyInfo.module.css'

const c = MATCHING_COPY.myInfo.availability

/** 고른 것만 남기기 (월요일부터 차례로) */
const toggle = <T extends string>(order: readonly T[], list: T[], key: T, checked: boolean) =>
  order.filter((item) => (item === key ? checked : list.includes(item)))

/**
 * 내 정보 › 만날 수 있는 때 고치기 (가입 질문 13번). 이 화면의 결정은 [저장하기] 하나입니다.
 * 저장 모양은 기획서대로 available_days · available_bands. 약속 탭의 시간 후보가 이 값에서 나옵니다.
 */
export function AvailabilityScreen() {
  const { availability } = useMyInfo()
  const [days, setDays] = useState<DayKey[]>(availability.available_days)
  const [bands, setBands] = useState<BandKey[]>(availability.available_bands)
  const messageId = useId()
  const valid = days.length > 0 && bands.length > 0

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!valid) return
    saveAvailability({ available_days: days, available_bands: bands })
    goBackTo(TAB_HASH.me)
  }

  return (
    <AppScreen title={c.title} back={TAB_HASH.me} nav="me">
      <form className="flex flex-col gap-6 xl:mx-auto xl:max-w-(--size-app-card-width)" onSubmit={submit} noValidate>
        <h1 className={`${styles.listTitle} sr-only xl:not-sr-only`}>{c.title}</h1>
        <Notice icon={clock}>{c.note}</Notice>
        <fieldset aria-describedby={valid ? undefined : messageId}>
          <legend className={own.legend}>{c.daysLegend}</legend>
          <div className="grid grid-cols-2 gap-x-4 md:grid-cols-4">
            {DAY_KEYS.map((day) => (
              <Checkbox key={day} checked={days.includes(day)} onChange={(checked) => setDays(toggle(DAY_KEYS, days, day, checked))}>
                {c.dayLabel(c.days[day])}
              </Checkbox>
            ))}
          </div>
        </fieldset>
        <fieldset aria-describedby={valid ? undefined : messageId}>
          <legend className={own.legend}>{c.bandsLegend}</legend>
          <div className="flex flex-col">
            {BAND_KEYS.map((band) => (
              <Checkbox key={band} checked={bands.includes(band)} onChange={(checked) => setBands(toggle(BAND_KEYS, bands, band, checked))}>
                {c.bands[band]}
              </Checkbox>
            ))}
          </div>
        </fieldset>
        <FieldMessage id={messageId} error={valid ? null : c.needOne} />
        <div className="xl:w-60 xl:self-end">
          <Button type="submit" disabled={!valid}>
            {c.save}
          </Button>
        </div>
      </form>
    </AppScreen>
  )
}
