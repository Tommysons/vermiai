import { getMemoryState } from './aiMemoryEngine'

// -----------------------------
// SAFE: get closed trades
// -----------------------------
function getClosedTrades() {
  const memory = getMemoryState()

  const trades = Array.isArray(memory?.trades) ? memory.trades : []

  return trades.filter(
    (t) => t.status === 'closed' && t.exitPrice !== undefined,
  )
}

// -----------------------------
// SIMPLE LEARNING SIGNAL
// -----------------------------
export function getCoinLearningSignals(coin: string) {
  const trades = getClosedTrades().filter((t) => t.coin === coin)

  if (!trades.length) {
    return {
      successRate: 0.5,
      confidence: 0.5,
    }
  }

  const wins = trades.filter(
    (t) => (t.exitPrice! - t.entryPrice) / t.entryPrice > 0,
  ).length

  const successRate = wins / trades.length

  return {
    successRate,
    confidence: Math.min(1, successRate + 0.2),
  }
}

// -----------------------------
// MAIN MODIFIER
// -----------------------------
export function getLearningModifier(coin: string) {
  const signal = getCoinLearningSignals(coin)

  if (signal.successRate > 0.7) return 1.2
  if (signal.successRate > 0.5) return 1.1
  if (signal.successRate < 0.3) return 0.85

  return 1
}
