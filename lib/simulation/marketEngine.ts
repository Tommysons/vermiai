import { random } from './randomEngine'

type MarketState = Record<string, number>

const STORAGE_KEY = 'vermi_market'

//Default prices
const DEFAULT_PRICES: MarketState = {
  BTC: 60000,
  ETH: 3000,
  USDC: 1,
  BNB: 600,
  SOL: 150,
  TON: 5,
}

//Load
function load(): MarketState {
  if (typeof window === 'undefined') return DEFAULT_PRICES

  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : DEFAULT_PRICES
}

//Save
function save(state: MarketState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

//Get prices
export function getMarket(): MarketState {
  return load()
}

//Simulate 1 day
export function simulateMarketDay(): MarketState {
  const market = load()

  const updated: MarketState = {}

  for (const coin in market) {
    const price = market[coin]

    //random movment: -3% to +3%
    const change = (random() - 0.5) * 0.05

    updated[coin] = +(price * change).toFixed(2)
  }

  save(updated)
  return updated
}
