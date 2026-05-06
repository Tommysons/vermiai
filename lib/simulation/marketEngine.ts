import { random } from './randomEngine'

type PricePoint = {
  price: number
  timestamp: number
}

// -----------------------------
// SIMPLE MARKET STATE
// -----------------------------
const market: Record<string, number> = {
  BTC: 65000,
  ETH: 3200,
  USDC: 1,
}

// -----------------------------
// MARKET HISTORY STORAGE
// -----------------------------
const history: Record<string, PricePoint[]> = {
  BTC: [],
  ETH: [],
  USDC: [],
}

// -----------------------------
// GET CURRENT MARKET
// -----------------------------
export function getMarket(): Record<string, number> {
  return market
}

// -----------------------------
// UPDATE HISTORY (call every tick)
// -----------------------------
export function updateMarketHistory() {
  const now = Date.now()

  for (const coin in market) {
    if (!history[coin]) history[coin] = []

    history[coin].push({
      price: market[coin],
      timestamp: now,
    })

    // keep memory small
    if (history[coin].length > 200) {
      history[coin].shift()
    }
  }
}

// -----------------------------
// GET MARKET HISTORY (🔥 FIXED EXPORT)
// -----------------------------
export function getMarketHistory(coin: string): PricePoint[] {
  return history[coin] ?? []
}

// -----------------------------
// OPTIONAL: SIMPLE PRICE FLUCTUATION (SIMULATION)
// -----------------------------
export function tickMarket() {
  for (const coin in market) {
    const change = (random() - 0.5) * 0.02 // ±1%
    market[coin] = Math.max(0.1, market[coin] * (1 + change))
  }

  updateMarketHistory()
}
