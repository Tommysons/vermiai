import { DailyEarning } from '../data/types'

export function getMonthlyEarnings(data: DailyEarning[]) {
  return data.reduce((sum, e) => sum + e.amountUSD, 0)
}

export function projectYearly(monthly: number) {
  return monthly * 12
}
