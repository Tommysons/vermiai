type TradeMemory = {
  id: string
  coin: string
  action: 'buy' | 'sell' | 'swap'
  amount: number
  entryPrice: number
  exitPrice?: number
  pnl?: number
  timestamp: number
}

type MemoryState = {
  history: TradeMemory[]
}

const STORAGE_KEY = 'vermi_ai_memory'

// -----------------------------
// LOAD
// -----------------------------
function load(): MemoryState {
  if (typeof window === 'undefined') {
    return { history: [] }
  }

  const data = localStorage.getItem(STORAGE_KEY)
  return data ? (JSON.parse(data) as MemoryState) : { history: [] }
}

// -----------------------------
// SAVE
// -----------------------------
function save(state: MemoryState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// -----------------------------
// RECORD TRADE (OPEN TRADE)
// -----------------------------
export function recordTrade(memory: TradeMemory) {
  const state = load()

  state.history.push(memory)

  if (state.history.length > 300) {
    state.history.shift()
  }

  save(state)
}

// -----------------------------
// CLOSE TRADE + CALCULATE PnL
// -----------------------------
export function closeTrade(id: string, exitPrice: number) {
  const state = load()

  const trade = state.history.find((t) => t.id === id)
  if (!trade || trade.exitPrice !== undefined) return

  trade.exitPrice = exitPrice

  const pnl = (exitPrice - trade.entryPrice) / trade.entryPrice
  trade.pnl = +pnl.toFixed(4)

  save(state)
}

// -----------------------------
// COIN PERFORMANCE (🔥 REAL PnL BASED)
// -----------------------------
export function getCoinPerformance(coin: string): number {
  const state = load()

  const trades = state.history.filter(
    (t) => t.coin === coin && t.pnl !== undefined,
  )

  if (trades.length === 0) return 0

  let score = 0

  for (const t of trades) {
    score += t.pnl ?? 0
  }

  return score / trades.length
}

// -----------------------------
// MEMORY PENALTY (AI RISK SIGNAL)
// -----------------------------
export function getMemoryPenalty(coin: string): number {
  const perf = getCoinPerformance(coin)

  if (perf < -0.05) return 0.3
  if (perf < 0) return 0.1

  return 0
}

// -----------------------------
// DEBUG
// -----------------------------
export function getMemoryState(): MemoryState {
  return load()
}
