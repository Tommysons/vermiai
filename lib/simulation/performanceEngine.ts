import { getMemoryState } from './aiMemoryEngine'

// -----------------------------
// TYPES
// -----------------------------
export type PerformanceReport = {
  totalPnL: number
  winRate: number
  avgWin: number
  avgLoss: number
  sharpe: number
  maxDrawdown: number
  trades: number
}

// -----------------------------
// GET CLOSED TRADES
// -----------------------------
function getClosedTrades() {
  return getMemoryState().history.filter(
    (t) => t.pnl !== undefined && t.exitPrice !== undefined,
  )
}

// -----------------------------
// MAIN CALCULATION
// -----------------------------
export function getPerformanceReport(): PerformanceReport {
  const trades = getClosedTrades()

  if (trades.length === 0) {
    return {
      totalPnL: 0,
      winRate: 0,
      avgWin: 0,
      avgLoss: 0,
      sharpe: 0,
      maxDrawdown: 0,
      trades: 0,
    }
  }

  let totalPnL = 0
  const wins: number[] = []
  const losses: number[] = []
  const equity: number[] = []
  let running = 0
  let peak = 0
  let maxDrawdown = 0

  // -----------------------------
  // PROCESS TRADES
  // -----------------------------
  for (const t of trades) {
    const pnl = t.pnl ?? 0
    totalPnL += pnl

    running += pnl
    equity.push(running)

    if (running > peak) peak = running

    const drawdown = peak - running
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }

    if (pnl >= 0) wins.push(pnl)
    else losses.push(pnl)
  }

  // -----------------------------
  // WIN RATE
  // -----------------------------
  const winRate = wins.length / trades.length

  // -----------------------------
  // AVERAGES
  // -----------------------------
  const avgWin =
    wins.length > 0 ? wins.reduce((a, b) => a + b, 0) / wins.length : 0

  const avgLoss =
    losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / losses.length : 0

  // -----------------------------
  // SHARPE RATIO (simplified)
  // -----------------------------
  const mean = trades.reduce((sum, t) => sum + (t.pnl ?? 0), 0) / trades.length

  const variance =
    trades.reduce((sum, t) => sum + Math.pow((t.pnl ?? 0) - mean, 2), 0) /
    trades.length

  const stdDev = Math.sqrt(variance)

  const sharpe = stdDev === 0 ? 0 : mean / stdDev

  // -----------------------------
  // RESULT
  // -----------------------------
  return {
    totalPnL,
    winRate,
    avgWin,
    avgLoss,
    sharpe,
    maxDrawdown,
    trades: trades.length,
  }
}
