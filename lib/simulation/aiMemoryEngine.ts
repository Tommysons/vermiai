export type TradeStatus = 'open' | 'closed'

export type Trade = {
  id: string
  coin: string
  action: 'swap'
  amount: number
  entryPrice: number
  exitPrice?: number
  pnl?: number
  status: TradeStatus
  openedAt: number
  closedAt?: number
}

type MemoryState = {
  trades: Trade[]
}

const STORAGE_KEY = 'vermi_trade_lifecycle'

// -----------------------------
// LOAD SAFE MEMORY
// -----------------------------
export function getMemoryState(): MemoryState {
  if (typeof window === 'undefined') return { trades: [] }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { trades: [] }

    const parsed = JSON.parse(raw)

    return {
      trades: Array.isArray(parsed?.trades) ? parsed.trades : [],
    }
  } catch {
    return { trades: [] }
  }
}

// -----------------------------
// SAVE
// -----------------------------
function save(state: MemoryState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// -----------------------------
// RECORD TRADE (OPEN)
// -----------------------------
export function recordTrade(trade: Omit<Trade, 'status'>) {
  const state = getMemoryState()

  state.trades.push({
    ...trade,
    status: 'open',
  })

  save(state)
}

// -----------------------------
// CLOSE TRADE
// -----------------------------
export function closeTrade(id: string, exitPrice: number) {
  const state = getMemoryState()

  const trade = state.trades.find((t) => t.id === id)
  if (!trade || trade.status === 'closed') return

  trade.exitPrice = exitPrice
  trade.pnl = (exitPrice - trade.entryPrice) / trade.entryPrice
  trade.status = 'closed'
  trade.closedAt = Date.now()

  save(state)
}

// -----------------------------
// OPEN TRADES
// -----------------------------
export function getOpenTrades(): Trade[] {
  const state = getMemoryState()
  return state.trades.filter((t) => t.status === 'open')
}

// -----------------------------
// CLOSED TRADES
// -----------------------------
export function getClosedTrades(): Trade[] {
  const state = getMemoryState()
  return state.trades.filter((t) => t.status === 'closed')
}
