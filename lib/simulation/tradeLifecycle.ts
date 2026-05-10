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
  pnl?: number
}

type TradeState = {
  trades: Trade[]
}

const STORAGE_KEY = 'vermi_trade_lifecycle'

// -----------------------------
// LOAD STATE
// -----------------------------
function load(): TradeState {
  if (typeof window === 'undefined') return { trades: [] }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { trades: [] }

    const parsed = JSON.parse(raw)

    if (!parsed?.trades || !Array.isArray(parsed.trades)) {
      return { trades: [] }
    }

    return parsed
  } catch {
    return { trades: [] }
  }
}

// -----------------------------
// SAVE STATE
// -----------------------------
function save(state: TradeState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// -----------------------------
// ADD OPEN TRADE
// -----------------------------
export function addOpenTrade(trade: Trade) {
  const state = load()

  state.trades.push({
    ...trade,
    status: 'open',
  })

  save(state)
}

// -----------------------------
// GET ALL TRADES
// -----------------------------
export function getAllTrades(): Trade[] {
  return load().trades
}

// -----------------------------
// GET OPEN TRADES
// -----------------------------
export function getOpenTrades(): Trade[] {
  return load().trades.filter((t) => t.status === 'open')
}

// -----------------------------
// CLOSE TRADE (FIXED + SAFE PnL)
// -----------------------------
export function closeTrade(id: string, exitPrice: number) {
  const state = load()

  const trade = state.trades.find((t) => t.id === id)

  if (!trade || trade.status === 'closed') return

  trade.exitPrice = exitPrice
  trade.status = 'closed'
  trade.closedAt = Date.now()

  // 🔥 CRITICAL FIX: always compute pnl here
  trade.pnl =
    trade.entryPrice > 0 ? (exitPrice - trade.entryPrice) / trade.entryPrice : 0

  save(state)
}

// -----------------------------
// GET TRADE PNL (SAFE)
// -----------------------------
export function getTradePnl(trade: Trade): number {
  if (trade.pnl != null) return trade.pnl

  if (trade.exitPrice == null) return 0

  return (trade.exitPrice - trade.entryPrice) / trade.entryPrice
}

// -----------------------------
// GET CLOSED TRADES
// -----------------------------
export function getClosedTrades(): Trade[] {
  return load().trades.filter((t) => t.status === 'closed')
}

// -----------------------------
// COIN PERFORMANCE
// -----------------------------
export function getCoinPnL(coin: string): number {
  const trades = getClosedTrades().filter((t) => t.coin === coin)

  if (!trades.length) return 0

  return trades.reduce((sum, t) => sum + getTradePnl(t), 0) / trades.length
}

// -----------------------------
// WEIGHTED PERFORMANCE
// -----------------------------
export function getWeightedCoinPnL(coin: string): number {
  const trades = getClosedTrades().filter((t) => t.coin === coin)

  if (!trades.length) return 0

  let total = 0
  let weight = 0

  for (const t of trades) {
    const pnl = getTradePnl(t)

    total += pnl * t.amount
    weight += t.amount
  }

  return weight === 0 ? 0 : total / weight
}

// -----------------------------
// RESET (debug tool)
// -----------------------------
export function resetTrades() {
  save({ trades: [] })
}
