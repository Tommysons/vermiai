import { buildPortfolio } from './portfolioEngine'
import { getAPR } from '../data/apr'
import { getRiskState } from './dynamicRiskEngine'
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
// RISK PENALTY
// -----------------------------
function riskPenalty(score: number): number {
  return score * score
}

// -----------------------------
// MEMORY (TEMP SAFE VERSION)
// -----------------------------
function memoryModifier(_: string): number {
  // ❗ simplified for stability (no broken dependencies)
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
  // SAFETY GUARD
  // -----------------------------
  if (portfolio.length < 2) {
    return {
      action: 'hold',
      reason: 'Not enough assets for trading',
      confidence: 0.6,
    }
  }

  // -----------------------------
  // ENRICH PORTFOLIO DATA
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
  // SORT BEST / WORST
  // -----------------------------
  const sorted = [...enriched].sort((a, b) => b.monthlyIncome - a.monthlyIncome)

  const best = sorted[0]
  const worst = sorted[sorted.length - 1]

  const avg =
    sorted.reduce((s, c) => s + c.monthlyIncome, 0) / (sorted.length || 1)

  const bestRatio = avg ? best.monthlyIncome / avg : 1
  const worstRatio = avg ? worst.monthlyIncome / avg : 1

  // -----------------------------
  // PORTFOLIO STRUCTURE
  // -----------------------------
  const totalValue = enriched.reduce((s, p) => s + p.value, 0)
  const bestShare = totalValue > 0 ? best.value / totalValue : 0

  // -----------------------------
  // FORCE ACTIVE SIMULATION
  // -----------------------------

  const shouldSwap =
    best.coin !== worst.coin && (bestRatio > 1.05 || worstRatio < 0.95)

  if (shouldSwap) {
    return {
      action: 'swap',
      fromCoin: worst.coin,
      toCoin: best.coin,
      reason: `${best.coin} outperforming ${worst.coin}`,
      confidence: 0.78,
    }
  }

  // fallback STILL produces action (important for simulation)
  return {
    action: 'swap',
    fromCoin: worst.coin,
    toCoin: best.coin,
    reason: 'Rebalancing portfolio to maintain activity',
    confidence: 0.55,
  }
}
