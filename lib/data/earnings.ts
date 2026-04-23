import { DailyEarning } from './types'

const STORE_KEY = 'vermiai_earnings'

export function getEarnings(): DailyEarning[] {
  if (typeof window === 'undefined') return []

  const stored = localStorage.getItem(STORE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function addEarning(entry: DailyEarning) {
  const current = getEarnings()
  const updated = [...current, entry]

  localStorage.setItem(STORE_KEY, JSON.stringify(updated))
}

export function getTotalEarnings() {
  const earnings = getEarnings()
  return earnings.reduce((sum, e) => sum + e.amountUSD, 0)
}
