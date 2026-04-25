import { buildPortfolio } from './portfolioEngine'
import { getAPR } from '../data/apr'
import { getRiskState } from './dynamicRiskEngine'
import { getCoinPerformance } from './aiMemoryEngine'

type Advice = 'hold' | 'increase' | 'decrease' | 'swap'

export type AIResult = {
  action: Advice
  fromCoin?: string
  toCoin?: string
  reason: string
  confidence: number
}

// -----------------------------
// helper: normalize risk penalty
// -----------------------------
function riskPenalty(score: number): number {
  // 0 = safe → 0 penalty
  // 1 = extreme → heavy penalty
  return score
}

// -----------------------------
// helper: memory boost/penalty
// -----------------------------
function memoryModifier(coin: string): number {
  const perf = getCoinPerformance(coin)

  if (perf > 0.7) return 1.15 // strong winner
  if (perf > 0.5) return 1.05
  if (perf < 0.3) return 0.85 // bad performer

  return 1
}

// -----------------------------
// MAIN AI
// -----------------------------
export function getAIAdviceV2(): AIResult {
  const portfolio = buildPortfolio()
  const riskState = getRiskState()

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

  // -----------------------------
  // enrich coins
  // -----------------------------
  const enriched = portfolio.map((p) => {
    const apr = getAPR(p.coin)

    const risk = riskState[p.coin]?.riskScore ?? 0.5

    const memory = memoryModifier(p.coin)

    const adjustedAPR = apr * memory * (1 - riskPenalty(risk))

    const monthlyIncome = (p.amount * adjustedAPR) / 100 / 12

    return {
      ...p,
      apr,
      risk,
      memory,
      monthlyIncome,
    }
  })

  // -----------------------------
  // sort performance
  // -----------------------------
  const sorted = [...enriched].sort((a, b) => b.monthlyIncome - a.monthlyIncome)

  const best = sorted[0]
  const worst = sorted[sorted.length - 1]

  const avg =
    sorted.reduce((sum, c) => sum + c.monthlyIncome, 0) / sorted.length

  const bestRatio = best.monthlyIncome / avg
  const worstRatio = worst.monthlyIncome / avg

  // -----------------------------
  // SAFETY FILTER (IMPORTANT FIX)
  // prevent swapping into bad coins repeatedly
  // -----------------------------
  const isBadCoin = worst.risk > 0.75 || worst.memory < 0.8

  const isBestSafe = best.risk < 0.7

  // -----------------------------
  // SWAP LOGIC (STABILIZED)
  // -----------------------------
  if (bestRatio > 1.25 && worstRatio < 0.85 && isBestSafe && !isBadCoin) {
    return {
      action: 'swap',
      fromCoin: worst.coin,
      toCoin: best.coin,
      reason: `${best.coin} outperforming ${worst.coin} (risk + memory adjusted)`,
      confidence: 0.8,
    }
  }

  // -----------------------------
  // DECREASE LOGIC
  // -----------------------------
  if (worstRatio < 0.9 || worst.risk > 0.8) {
    return {
      action: 'decrease',
      fromCoin: worst.coin,
      reason: `${worst.coin} is underperforming or too risky`,
      confidence: 0.7,
    }
  }

  // -----------------------------
  // HOLD
  // -----------------------------
  return {
    action: 'hold',
    reason: 'Portfolio is stable under risk + memory evaluation',
    confidence: 0.65,
  }
}
