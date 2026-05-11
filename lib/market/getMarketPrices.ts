import { tokenMap } from '@/lib/data/tokenMap'

export type MarketPrices = {
  BTC: number
  ETH: number
  SOL: number
  TON: number
  BNB: number
  GOMINING: number
  USDC: number
}

export async function getMarketPrices(): Promise<MarketPrices> {
  const ids = Object.values(tokenMap).join(',')

  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
    { cache: 'no-store' },
  )

  const data = await res.json()

  return {
    BTC: data.bitcoin?.usd ?? 0,
    ETH: data.ethereum?.usd ?? 0,
    SOL: data.solana?.usd ?? 0,
    TON: data['the-open-network']?.usd ?? 0,
    BNB: data.binancecoin?.usd ?? 0,
    GOMINING: data['gomining-token']?.usd ?? 0,
    USDC: 1,
  }
}
