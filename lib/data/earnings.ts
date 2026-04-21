import { DailyEarning } from './types'

const earnings: DailyEarning[] = []

export function addEarning(entry: DailyEarning) {
  earnings.push(entry)
}

export function getEarnings() {
  return earnings
}

export function getTotalEarnings() {
  return earnings.reduce((sum, e) => sum + e.amountUSD, 0)
}
