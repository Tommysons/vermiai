import { getAIAdviceV2 } from './aiAdvisorV2'
import { buildPortfolio } from './portfolioEngine'
import { addTransaction } from '../data/transactions'

export type ExecutionResult =
  | {
      executed: true
      action: 'swap'
      from: string
      to: string
      amount: number
    }
  | {
      executed: false
      action: string
      reason: string
    }

export function runAIExecution(): ExecutionResult {
  const ai = getAIAdviceV2()
  const portfolio = buildPortfolio()

  // -----------------------------
  // SWAP LOGIC
  // -----------------------------
  if (ai.action === 'swap' && ai.fromCoin && ai.toCoin) {
    const fromCoin = ai.fromCoin
    const toCoin = ai.toCoin

    const from = portfolio.find(
      (i) => i.coin.toUpperCase() === fromCoin.toUpperCase(),
    )

    if (!from || from.amount <= 0) {
      return {
        executed: false,
        action: ai.action,
        reason: 'Invalid source coin or amount',
      }
    }

    // 🔥 stability: only partial swap
    const SWAP_RATIO = 0.4
    const amount = from.amount * SWAP_RATIO

    const now = new Date().toISOString()

    // -----------------------------
    // WRITE EVENT (source of truth)
    // -----------------------------
    addTransaction({
      type: 'swap',
      from: fromCoin,
      to: toCoin,
      amount,
      date: now,
    })

    return {
      executed: true,
      action: 'swap',
      from: fromCoin,
      to: toCoin,
      amount,
    }
  }

  // -----------------------------
  // NO ACTION
  // -----------------------------
  return {
    executed: false,
    action: ai.action,
    reason: ai.reason,
  }
}
