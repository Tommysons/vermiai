import { DailyEarning } from '../data/types'

type ROIResult = {
  minerROI: number
  aprSimpleEarn: number
  tokenAPR: number
}

export function calculateROI(earnings: DailyEarning[]): ROIResult {
  const miner = earnings
    .filter((e) => e.source === 'miner')
    .reduce((sum, e) => sum + e.amountUSD, 0)

  const staking = earnings
    .filter((e) => e.source === 'staking')
    .reduce((sum, e) => sum + e.amountUSD, 0)

  const gomining = earnings
    .filter((e) => e.source === 'gomining')
    .reduce((sum, e) => sum + e.amountUSD, 0)

  const total = miner + staking + gomining || 1

  return {
    minerROI: (miner / total) * 100,
    aprSimpleEarn: (staking / total) * 100,
    tokenAPR: (gomining / total) * 100,
  }
}
