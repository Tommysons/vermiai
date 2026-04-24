import { buildPortfolio } from './portfolioEngine'
import { getAPR } from '../data/apr'

type Advice = 'hold' | 'increase' | 'decrease' | 'swap'

export type AIResult = {
  action: Advice
  fromCoin?: string
  toCoin?: string
  reason: string
  confidence: number
}

export function getAIAdviceV2(): AIResult {
  const portfolio = buildPortfolio()

  if (portfolio.length === 0) {
    return {
      action: 'hold',
      reason: 'No portfolio data',
      confidence: 0.5,
    }
  }

  if (portfolio.length === 1) {
    return {
      action: 'hold',
      reason: 'Single asset, no diversification possible',
      confidence: 0.6,
    }
  }

  // calculate performance per coin
  const enriched = portfolio.map((p) => {
    const apr = getAPR(p.coin)

    const monthlyIncome = (p.amount * apr) / 100 / 12

    return {
      ...p,
      apr,
      monthlyIncome,
    }
  })

  //sort by performance
  const sorted = [...enriched].sort((a, b) => b.monthlyIncome - a.monthlyIncome)

  const best = sorted[0]
  const worst = sorted[sorted.length - 1]

  const avg =
    sorted.reduce((sum, c) => sum + c.monthlyIncome, 0) / sorted.length

  const bestRatio = best.monthlyIncome / avg
  const worstRatio = worst.monthlyIncome / avg

  // strong signal -> swap
  if (bestRatio > 1.3 && worstRatio < 0.8) {
    return {
      action: 'swap',
      fromCoin: worst.coin,
      toCoin: best.coin,
      reason: `${best.coin} significantly outperforming ${worst.coin}`,
      confidence: 0.75,
    }
  }

  //weak coin -> decrease
  if (worstRatio < 0.9) {
    return {
      action: 'decrease',
      fromCoin: worst.coin,
      reason: `${worst.coin} is underperforming `,
      confidence: 0.65,
    }
  }

  //balanced
  return {
    action: 'hold',
    reason: 'Portfolio is balanced',
    confidence: 0.6,
  }
}
