import { COINS } from '@/lib/coins'

export async function GET() {
  const ids = Object.values(COINS)
    .map((c) => c.id)
    .join(',')

  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
    { cache: 'no-store' },
  )

  const data = await res.json()

  const prices: Record<string, number> = {}

  for (const key in COINS) {
    const coin = COINS[key as keyof typeof COINS]
    prices[key] = data[coin.id]?.usd ?? 0
  }

  return Response.json(prices)
}
