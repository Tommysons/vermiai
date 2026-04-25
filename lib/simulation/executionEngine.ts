import { getAIAdviceV2 } from './aiAdvisorV2'
import type { AIResult } from './aiAdvisorV2'

import { buildPortfolio } from './portfolioEngine'
import { addTransaction } from '../data/transactions'
import { recordTrade } from './aiMemoryEngine'
import { getMarket } from './marketEngine'

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

// -----------------------------
// ANTI-SPAM MEMORY
// -----------------------------
let lastActionKey: string | null = null
let lastTick = 0

function getActionKey(ai: AIResult) {
  return `${ai.action}-${ai.fromCoin ?? ''}-${ai.toCoin ?? ''}`
}

// -----------------------------
// EXECUTION ENGINE
// -----------------------------
export function runAIExecution(): ExecutionResult {
  const ai: AIResult = getAIAdviceV2()
  const portfolio = buildPortfolio()
  const market = getMarket()

  const actionKey = getActionKey(ai)
  const now = Date.now()

  // -----------------------------
  // COOLDOWN (ANTI-SPAM)
  // -----------------------------
  if (lastActionKey === actionKey && now - lastTick < 120000) {
    return {
      executed: false,
      action: ai.action,
      reason: 'Cooldown active',
    }
  }

  lastActionKey = actionKey
  lastTick = now

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

    // only partial swap (stability)
    const SWAP_RATIO = 0.25
    const amount = from.amount * SWAP_RATIO

    // entry price locked at execution time
    const entryPrice = typeof market[toCoin] === 'number' ? market[toCoin] : 1

    const tradeId = crypto.randomUUID()

    // -----------------------------
    // TRANSACTION (source of truth)
    // -----------------------------
    addTransaction({
      type: 'swap',
      from: fromCoin,
      to: toCoin,
      amount,
      date: new Date().toISOString(),
    })

    // -----------------------------
    // MEMORY (PnL SYSTEM INPUT)
    // -----------------------------
    recordTrade({
      id: tradeId,
      coin: toCoin,
      action: 'swap',
      amount,
      entryPrice,
      timestamp: Date.now(),
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
