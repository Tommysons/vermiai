import { getMemoryState } from './aiMemoryEngine'

// -----------------------------
// AI LEARNING ENGINE
// -----------------------------
// Turns trade history into learning signals

type LearningSignal = {
  coin: string
  avgPnL: number
  trades: number
  score: number // -1 to +1
}

// -----------------------------
// CLOSED TRADES ONLY
// -----------------------------
function getClosedTrades() {
  const memory = getMemoryState()

  return memory.history.filter(
    (t) => t.pnl !== undefined && t.exitPrice !== undefined,
  )
}

// -----------------------------
// PERFORMANCE PER COIN
// -----------------------------
export function getCoinLearningSignals(): LearningSignal[] {
  const trades = getClosedTrades()

  const map: Record<string, { pnlSum: number; count: number }> = {}

  for (const t of trades) {
    if (!map[t.coin]) {
      map[t.coin] = { pnlSum: 0, count: 0 }
    }

    map[t.coin].pnlSum += t.pnl ?? 0
    map[t.coin].count += 1
  }

  return Object.entries(map).map(([coin, data]) => {
    const avgPnL = data.pnlSum / data.count

    // normalize to -1 → +1
    const score = Math.max(-1, Math.min(1, avgPnL * 5))

    return {
      coin,
      avgPnL,
      trades: data.count,
      score,
    }
  })
}

// -----------------------------
// AI LEARNING MODIFIER
// -----------------------------
export function getLearningModifier(coin: string): number {
  const signals = getCoinLearningSignals()

  const found = signals.find((s) => s.coin === coin)
  if (!found) return 1

  return 1 + found.score * 0.3
}
