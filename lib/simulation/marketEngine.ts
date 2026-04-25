import { random } from './randomEngine'
import { marketState } from './marketState'
import { maybeTriggerNews } from './newsEngine'
import { updateRiskState } from './dynamicRiskEngine'

type MarketState = Record<string, number>

const STORAGE_KEY = 'vermi_market'

// -----------------------------
// DEFAULT PRICES
// -----------------------------
const DEFAULT_PRICES: MarketState = {
  BTC: 60000,
  ETH: 4000,
  USDC: 1,
  BNB: 600,
  SOL: 150,
  TON: 5,
}

// -----------------------------
// LOAD
// -----------------------------
function load(): MarketState {
  if (typeof window === 'undefined') return DEFAULT_PRICES

  const data = localStorage.getItem(STORAGE_KEY)
  return data ? (JSON.parse(data) as MarketState) : DEFAULT_PRICES
}

// -----------------------------
// SAVE
// -----------------------------
function save(state: MarketState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// -----------------------------
// GET MARKET
// -----------------------------
export function getMarket(): MarketState {
  return load()
}

// -----------------------------
// PRICE SAFETY (optional but smart)
// -----------------------------
function clampPrice(coin: string, price: number): number {
  if (coin === 'USDC') return 1

  const min = 0.01
  const max = 1_000_000

  return Math.min(Math.max(price, min), max)
}

// -----------------------------
// COIN VOLATILITY PROFILE
// -----------------------------
function getCoinVolatility(coin: string): number {
  switch (coin) {
    case 'BTC':
      return 0.02
    case 'ETH':
      return 0.03
    case 'BNB':
      return 0.035
    case 'SOL':
      return 0.06
    case 'TON':
      return 0.07
    case 'USDC':
      return 0.001
    default:
      return 0.05
  }
}

// -----------------------------
// SIMULATE 1 DAY
// -----------------------------
export function simulateMarketDay(): MarketState {
  const market = load()

  const { cycle, volatility } = marketState

  const news = maybeTriggerNews()

  const updated: MarketState = {}
  const riskUpdates: Record<string, number> = {}

  for (const coin in market) {
    const price = market[coin]

    // -----------------------------
    // MARKET TREND (cycle)
    // -----------------------------
    let trend = 0

    switch (cycle) {
      case 'bull':
        trend = 0.002
        break
      case 'bear':
        trend = -0.0025
        break
      case 'crash':
        trend = -0.01
        break
      case 'recovery':
        trend = 0.004
        break
    }

    // -----------------------------
    // COIN VOLATILITY
    // -----------------------------
    const coinVolatility = getCoinVolatility(coin)

    // -----------------------------
    // NEWS IMPACT
    // -----------------------------
    let newsImpact = 0
    let newsVolatility = 0

    if (news) {
      const affects = !news.affectedCoins || news.affectedCoins.includes(coin)

      if (affects) {
        newsImpact = news.impact
        newsVolatility = news.volatilityBoost
      }
    }

    // -----------------------------
    // FINAL CHANGE
    // -----------------------------
    const noise =
      (random() - 0.5) * (volatility + coinVolatility + newsVolatility)

    const change = trend + noise + newsImpact

    // -----------------------------
    // APPLY PRICE
    // -----------------------------
    const newPrice = price * (1 + change)

    const safePrice = clampPrice(coin, newPrice)

    updated[coin] = +safePrice.toFixed(2)

    // -----------------------------
    // 🔥 RISK SIGNAL (CRITICAL)
    // -----------------------------
    const volatilitySignal = Math.abs(change)
    const randomness = random() * 0.1

    riskUpdates[coin] = Math.min(1, volatilitySignal + randomness)
  }

  // -----------------------------
  // 🔥 UPDATE RISK SYSTEM
  // -----------------------------
  updateRiskState(riskUpdates)

  save(updated)
  return updated
}
