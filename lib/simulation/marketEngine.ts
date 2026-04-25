import { random } from './randomEngine'
import { marketState } from './marketState'
import { maybeTriggerNews } from './newsEngine'
import { getCoinProfile } from './coinProfile'

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
// SAFE PRICE LIMITS (prevents chaos)
// -----------------------------
function clampPrice(coin: string, price: number): number {
  if (coin === 'USDC') return 1 // stablecoin lock

  const min = 0.01
  const max = 1_000_000

  return Math.min(Math.max(price, min), max)
}

// -----------------------------
// SIMULATE 1 DAY (WITH REAL CYCLES)
// -----------------------------
export function simulateMarketDay(): MarketState {
  const market = load()

  const { cycle, volatility } = marketState

  // -----------------------------
  // NEWS EVENT
  // -----------------------------
  const news = maybeTriggerNews()

  const updated: MarketState = {}

  for (const coin in market) {
    const price = market[coin]

    const profile = getCoinProfile(coin)

    // -----------------------------
    // BASE TREND (cycle-based)
    // -----------------------------
    let trend = 0

    switch (cycle) {
      case 'bull':
        trend = 0.0015
        break
      case 'bear':
        trend = -0.0018
        break
      case 'crash':
        trend = -0.01
        break
      case 'recovery':
        trend = 0.003
        break
    }

    trend *= profile.baseTrendStrength

    // -----------------------------
    // NEWS IMPACT (coin-specific)
    // -----------------------------
    let newsImpact = 0
    let newsVolatility = 0

    if (news) {
      const affectsCoin =
        !news.affectedCoins || news.affectedCoins.includes(coin)

      if (affectsCoin) {
        newsImpact = news.impact * profile.newsSensitivity
        newsVolatility = news.volatilityBoost * profile.newsSensitivity
      }
    }

    // -----------------------------
    // RANDOM VOLATILITY (coin-specific)
    // -----------------------------
    const noise =
      (random() - 0.5) * (volatility + profile.volatility + newsVolatility)

    // -----------------------------
    // FINAL PRICE CHANGE
    // -----------------------------
    const change = trend + noise + newsImpact

    const newPrice = price * (1 + change)

    updated[coin] = +clampPrice(coin, newPrice).toFixed(2)
  }

  save(updated)
  return updated
}
