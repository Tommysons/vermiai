export type CoinAPR = {
  coin: string
  apr: number // in %
  updatedAt?: string
  source?: 'manual' | 'api'
}

export const APR_CONFIG: CoinAPR[] = [
  { coin: 'BTC', apr: 2.68, source: 'manual' },
  { coin: 'ETH', apr: 1.77, source: 'manual' },
  { coin: 'USDC', apr: 11.62, source: 'manual' },
  { coin: 'BNB', apr: 0.5, source: 'manual' },
  { coin: 'SOL', apr: 3.95, source: 'manual' },
  { coin: 'TON', apr: 15.58, source: 'manual' },
]

export function getAPR(coin: string): number {
  const found = APR_CONFIG.find(
    (c) => c.coin.toLowerCase() === coin.toLowerCase(),
  )
  return found ? found.apr : 0
}
