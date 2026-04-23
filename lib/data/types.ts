export type EarningSource = 'gomining' | 'staking' | 'miner' | 'other'

export type DailyEarning = {
  id: string
  date: string
  amountUSD: number
  source: EarningSource
}

export type Advice = 'buy_miner' | 'stake' | 'hold' | 'compound'

export type AIResult = {
  action: Advice
  reason: string
  confidence: number
}

export type AIInput = {
  cash: number
  aprSimpleEarn: number
  minerROI: number
  tokenAPR: number
}
