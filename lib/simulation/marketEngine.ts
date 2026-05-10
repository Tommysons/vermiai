import { getMemoryState } from './aiMemoryEngine'

type Market = Record<string, number>

const market: Market = {
  BTC: 50000,
  ETH: 3000,
  SOL: 120,
}

export function getMarket() {
  return market
}

// -----------------------------
// PRICE UPDATE
// -----------------------------
export function tickMarket() {
  const memory = getMemoryState()
  const trades = memory.trades ?? []

  for (const coin of Object.keys(market)) {
    const change = (Math.random() - 0.5) * 0.02
    market[coin] = Math.max(1, market[coin] * (1 + change))
  }

  // safe iteration
  for (const trade of trades) {
    if (trade.status !== 'open') continue

    const age = Date.now() - trade.openedAt

    if (age > 60000) {
      // placeholder
    }
  }

  return market
}
