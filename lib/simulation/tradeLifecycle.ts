type TradeStatus = 'open' | 'closed'

export type Trade = {
  id: string
  coin: string
  action: 'swap'
  amount: number
  entryPrice: number
  exitPrice?: number
  status: TradeStatus
  openedAt: number
  closedAt?: number
}

type TradeState = {
  trades: Trade[]
}

const STORAGE_KEY = 'vermi_trade_lifecycle'

// -----------------------------
// LOAD (SAFE)
// -----------------------------
function load(): TradeState {
  if (typeof window === 'undefined') return { trades: [] }

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return { trades: [] }

    const parsed = JSON.parse(data)

    if (!parsed || !Array.isArray(parsed.trades)) {
      return { trades: [] }
    }

    return parsed as TradeState
  } catch {
    return { trades: [] }
  }
}

// -----------------------------
// SAVE
// -----------------------------
function save(state: TradeState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// -----------------------------
// ADD OPEN TRADE
// -----------------------------
export function addOpenTrade(trade: Trade) {
  const state = load()
  state.trades.push(trade)
  save(state)
}

// -----------------------------
// GET OPEN TRADES
// -----------------------------
export function getOpenTrades(): Trade[] {
  return load().trades.filter((t) => t.status === 'open')
}

// -----------------------------
// CLOSE TRADE
// -----------------------------
export function closeTrade(id: string, exitPrice: number) {
  const state = load()

  const trade = state.trades.find((t) => t.id === id)
  if (!trade || trade.status === 'closed') return

  trade.exitPrice = exitPrice
  trade.status = 'closed'
  trade.closedAt = Date.now()

  save(state)
}

// -----------------------------
// BASIC PnL (per trade)
// -----------------------------
export function getTradePnl(trade: Trade): number {
  if (!trade.exitPrice) return 0
  return (trade.exitPrice - trade.entryPrice) / trade.entryPrice
}

// -----------------------------
// COIN PERFORMANCE (simple avg)
// -----------------------------
export function getCoinPnL(coin: string): number {
  const state = load()

  const trades = state.trades.filter(
    (t) => t.coin === coin && t.status === 'closed',
  )

  if (trades.length === 0) return 0

  let total = 0

  for (const t of trades) {
    total += getTradePnl(t)
  }

  return total / trades.length
}

// -----------------------------
// WEIGHTED COIN PERFORMANCE (recommended for AI)
// -----------------------------
export function getWeightedCoinPnL(coin: string): number {
  const state = load()

  const trades = state.trades.filter(
    (t) => t.coin === coin && t.status === 'closed',
  )

  if (trades.length === 0) return 0

  let total = 0
  let weightSum = 0

  for (const t of trades) {
    const pnl = getTradePnl(t)
    const weight = t.amount

    total += pnl * weight
    weightSum += weight
  }

  return weightSum === 0 ? 0 : total / weightSum
}

// -----------------------------
// RESET (useful for testing)
// -----------------------------
export function resetTrades() {
  save({ trades: [] })
}
