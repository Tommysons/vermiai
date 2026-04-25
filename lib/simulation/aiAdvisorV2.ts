import { buildPortfolio } from './portfolioEngine'
import { getAPR } from '../data/apr'
import { getRiskPenalty, getRiskLevel } from './riskEngine'

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

  // -----------------------------
  // EDGE CASES
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
  // ENRICH PORTFOLIO WITH RISK + RETURNS
  // -----------------------------
  const enriched = portfolio.map((p) => {
    const apr = getAPR(p.coin)
    const riskPenalty = getRiskPenalty(p.coin)
    const riskLevel = getRiskLevel(p.coin)

    const monthlyIncome = ((p.amount * apr) / 100 / 12) * (1 - riskPenalty)

    return {
      ...p,
      apr,
      monthlyIncome,
      riskPenalty,
      riskLevel,
    }
  })

  // -----------------------------
  // RISK-WEIGHTED SCORING
  // -----------------------------
  const scored = enriched.map((p) => {
    const riskWeight =
      p.riskLevel === 'high'
        ? 0.6
        : p.riskLevel === 'medium'
          ? 0.8
          : p.riskLevel === 'low'
            ? 1
            : 1.1 // stable / safe assets

    const score = p.monthlyIncome * riskWeight

    return { ...p, score }
  })

  const sorted = [...scored].sort((a, b) => b.score - a.score)

  const best = sorted[0]
  const worst = sorted[sorted.length - 1]

  // -----------------------------
  // AVERAGE SCORE
  // -----------------------------
  const avg = sorted.reduce((sum, c) => sum + c.score, 0) / sorted.length

  const bestRatio = best.score / avg
  const worstRatio = worst.score / avg

  // -----------------------------
  // SWAP LOGIC (risk-aware)
  // -----------------------------
  if (bestRatio > 1.25 && worstRatio < 0.85 && best.riskLevel !== 'high') {
    return {
      action: 'swap',
      fromCoin: worst.coin,
      toCoin: best.coin,
      reason: `${best.coin} risk-adjusted outperforms ${worst.coin}`,
      confidence: 0.8,
    }
  }

  // -----------------------------
  // DECREASE LOGIC
  // -----------------------------
  if (worstRatio < 0.9 || worst.riskLevel === 'high') {
    return {
      action: 'decrease',
      fromCoin: worst.coin,
      reason: `${worst.coin} is too risky or underperforming`,
      confidence: 0.7,
    }
  }

  // -----------------------------
  // DEFAULT
  // -----------------------------
  return {
    action: 'hold',
    reason: 'Portfolio is balanced',
    confidence: 0.6,
  }
}
