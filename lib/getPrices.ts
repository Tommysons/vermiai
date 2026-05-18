import { COINS, type Coin } from './coins'

export async function getPrices(): Promise<Record<Coin, number>> {
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

  return {
    BTC: data.bitcoin?.usd ?? 0,
    ETH: data.ethereum?.usd ?? 0,
    SOL: data.solana?.usd ?? 0,
    TON: data['the-open-network']?.usd ?? 0,
    BNB: data.binancecoin?.usd ?? 0,
    USDC: data['usd-coin']?.usd ?? 1,
  }
}
