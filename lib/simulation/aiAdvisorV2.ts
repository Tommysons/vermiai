import { buildPortfolio } from './portfolioEngine'
import { getAPR } from '../data/apr'
import { getRiskState } from './dynamicRiskEngine'
import { getCoinPerformance } from './aiMemoryEngine'
import { getLearningModifier } from './aiLearningEngine'
import { getMarket } from './marketEngine'

type Advice = 'hold' | 'increase' | 'decrease' | 'swap'

export type AIResult = {
  action: Advice
  reason: string
  confidence: number
  fromCoin?: string
  toCoin?: string
}

// -----------------------------
// RISK PENALTY (non-linear)
// -----------------------------
function riskPenalty(score: number): number {
  return score * score
}

// -----------------------------
// MEMORY MODIFIER (behavior)
// -----------------------------
function memoryModifier(coin: string): number {
  const perf = getCoinPerformance(coin)

  if (perf > 0.7) return 1.2
  if (perf > 0.5) return 1.1
  if (perf < 0.3) return 0.8

  return 1
}

// -----------------------------
// MAIN AI
// -----------------------------
export function getAIAdviceV2(): AIResult {
  const portfolio = buildPortfolio()
  const riskState = getRiskState()
  const market = getMarket()

  // -----------------------------
  // GUARDS
  // -----------------------------
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
  // ENRICH DATA
  // -----------------------------
  const enriched = portfolio.map((p) => {
    const apr = getAPR(p.coin)
    const risk = riskState[p.coin]?.riskScore ?? 0.5
    const memory = memoryModifier(p.coin)
    const learning = getLearningModifier(p.coin)

    const adjustedAPR = apr * memory * learning * (1 - riskPenalty(risk))

    const monthlyIncome = (p.amount * adjustedAPR) / 100 / 12

    const price = market[p.coin] ?? 1
    const value = p.amount * price

    return {
      ...p,
      apr,
      risk,
      memory,
      learning,
      adjustedAPR,
      monthlyIncome,
      value,
    }
  })

  // -----------------------------
  // SORT
  // -----------------------------
  const sorted = [...enriched].sort((a, b) => b.monthlyIncome - a.monthlyIncome)

  const best = sorted[0]
  const worst = sorted[sorted.length - 1]

  const avg =
    sorted.reduce((sum, c) => sum + c.monthlyIncome, 0) / (sorted.length || 1)

  const bestRatio = avg > 0 ? best.monthlyIncome / avg : 1
  const worstRatio = avg > 0 ? worst.monthlyIncome / avg : 1

  // -----------------------------
  // SAFETY FILTERS
  // -----------------------------
  const isBadCoin = worst.risk > 0.75 || worst.memory < 0.85

  const isBestSafe = best.risk < 0.65

  const alreadySame = best.coin === worst.coin

  // portfolio value-based concentration
  const totalValue = enriched.reduce((sum, p) => sum + p.value, 0)

  const bestShare = totalValue > 0 ? best.value / totalValue : 0

  const isOverConcentrated = bestShare > 0.6

  // -----------------------------
  // SWAP DECISION
  // -----------------------------
  if (
    bestRatio > 1.35 && // slightly reduced from 1.4 (more responsive)
    worstRatio < 0.9 &&
    isBestSafe &&
    !isBadCoin &&
    !alreadySame &&
    !isOverConcentrated
  ) {
    return {
      action: 'swap',
      fromCoin: worst.coin,
      toCoin: best.coin,
      reason: `${best.coin} outperforming ${worst.coin} (risk + learning adjusted)`,
      confidence: 0.85,
    }
  }

  // -----------------------------
  // DECREASE DECISION
  // -----------------------------
  if (worstRatio < 0.85 || worst.risk > 0.8) {
    return {
      action: 'decrease',
      fromCoin: worst.coin,
      reason: `${worst.coin} underperforming or high risk`,
      confidence: 0.7,
    }
  }

  // -----------------------------
  // HOLD
  // -----------------------------
  return {
    action: 'hold',
    reason: 'No strong signal detected (stable conditions)',
    confidence: 0.65,
  }
}
