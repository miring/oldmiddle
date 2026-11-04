import { useSyncExternalStore } from 'react'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { getMyInfo, getMyInfoVersion, subscribeMyInfo } from '../../mocks/myInfo'
import { BAND_KEYS, DAY_KEYS, type Availability } from './myInfoTypes'

/** 화면이 쓰는 내 정보. 더미 데이터가 바뀌면(저장, 미리보기 설정) 다시 그립니다 */
export function useMyInfo() {
  useSyncExternalStore(subscribeMyInfo, getMyInfoVersion)
  return getMyInfo()
}

const c = MATCHING_COPY.myInfo.availability

/** '토·일' (월요일부터 차례로) */
export const formatDays = (availability: Availability) =>
  DAY_KEYS.filter((day) => availability.available_days.includes(day))
    .map((day) => c.days[day])
    .join('·')

/** '오전 늦게 (11~13시) · 오후 (13~18시)' */
export const formatBands = (availability: Availability) =>
  BAND_KEYS.filter((band) => availability.available_bands.includes(band))
    .map((band) => c.bands[band])
    .join(' · ')

/** '2026-11' → '2026년 11월' */
export const formatMonth = (month: string) => {
  const [year, monthNumber] = month.split('-').map(Number)
  return `${year}년 ${monthNumber}월`
}

/** '2026-12-03' → '12월 3일' */
export const formatDate = (date: string) => {
  const [, month, day] = date.split('-').map(Number)
  return `${month}월 ${day}일`
}
