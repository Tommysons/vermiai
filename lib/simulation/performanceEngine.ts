import { getMemoryState } from './aiMemoryEngine'

type Trade = {
  coin: string
  entryPrice: number
  exitPrice?: number
  amount: number
}

// -----------------------------
// TRADES WITH PnL
// -----------------------------
function getTrades(): (Trade & { pnl: number })[] {
  const memory = getMemoryState()

  return memory.trades.map((t) => {
    const exit = t.exitPrice ?? t.entryPrice
    const pnl = (exit - t.entryPrice) / t.entryPrice

    return { ...t, pnl }
  })
}

// -----------------------------
export function getTotalPnL() {
  const trades = getTrades()
  return trades.reduce((s, t) => s + t.pnl, 0)
}

// -----------------------------
export function getWinRate() {
  const trades = getTrades()
  if (!trades.length) return 0

  return trades.filter((t) => t.pnl > 0).length / trades.length
}

// -----------------------------
export function getSharpeRatio() {
  const trades = getTrades()
  if (!trades.length) return 0

  const r = trades.map((t) => t.pnl)
  const avg = r.reduce((a, b) => a + b, 0) / r.length
  const variance = r.reduce((a, v) => a + (v - avg) ** 2, 0) / r.length

  return variance === 0 ? 0 : avg / Math.sqrt(variance)
}

// -----------------------------
// REAL EQUITY CURVE
// -----------------------------
export function getEquityCurve() {
  const trades = getTrades()

  let equity = 1

  return trades.map((t) => {
    equity = equity * (1 + t.pnl)
    return equity
  })
}

// -----------------------------
export function getDrawdownCurve() {
  const equity = getEquityCurve()

  let peak = 0

  return equity.map((v) => {
    if (v > peak) peak = v
    return peak - v
  })
}

// -----------------------------
export function getPerformanceReport() {
  const trades = getTrades()

  const wins = trades.filter((t) => t.pnl > 0)
  const losses = trades.filter((t) => t.pnl <= 0)

  return {
    trades: trades.length,
    totalPnL: getTotalPnL(),
    winRate: getWinRate(),
    sharpe: getSharpeRatio(),
    maxDrawdown: Math.max(...getDrawdownCurve(), 0),
    avgWin:
      wins.length > 0 ? wins.reduce((a, b) => a + b.pnl, 0) / wins.length : 0,
    avgLoss:
      losses.length > 0
        ? losses.reduce((a, b) => a + b.pnl, 0) / losses.length
        : 0,
  }
}
