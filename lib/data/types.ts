export type EarningSource = 'gomining' | 'staking' | 'miner' | 'other'

export type DailyEarning = {
  id: string
  date: string
  amountUSD: number
  source: EarningSource
}
