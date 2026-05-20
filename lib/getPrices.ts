import { COINS, type Coin } from './coins'

let cachedPrices: Record<Coin, number> | null = null
let lastFetch = 0
const CACHE_DURATION = 30 * 1000 // 30 seconds

export async function getPrices(): Promise<Record<Coin, number>> {
  const now = Date.now()
  //Return Cache if still valid
  if (cachedPrices && now - lastFetch < CACHE_DURATION) {
    console.log('Using cached prices')
    return cachedPrices
  }

  //Fetch from coingecko
  console.log('Fetching fresh prices from CoinGecko')

  const ids = Object.values(COINS)
    .map((coin) => coin.id)
    .join(',')

  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
    {
      cache: 'no-store',
    },
  )

  const data = await res.json()

  const prices: Record<Coin, number> = {
    BTC: data.bitcoin?.usd ?? 0,
    ETH: data.ethereum?.usd ?? 0,
    SOL: data.solana?.usd ?? 0,
    TON: data['the-open-network']?.usd ?? 0,
    BNB: data.binancecoin?.usd ?? 0,
    USDC: data['usd-coin']?.usd ?? 1,
  }

  //save Cache
  cachedPrices = prices
  lastFetch = now
  return prices
}
