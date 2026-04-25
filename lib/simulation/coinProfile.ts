export type CoinProfile = {
  coin: string
  volatility: number
  newsSensitivity: number
  baseTrendStrength: number
}

export const COIN_PROFILES: CoinProfile[] = [
  {
    coin: 'BTC',
    volatility: 0.02,
    newsSensitivity: 1.0,
    baseTrendStrength: 1.0,
  },
  {
    coin: 'ETH',
    volatility: 0.03,
    newsSensitivity: 1.1,
    baseTrendStrength: 1.1,
  },
  {
    coin: 'BNB',
    volatility: 0.035,
    newsSensitivity: 1.0,
    baseTrendStrength: 0.9,
  },
  {
    coin: 'SOL',
    volatility: 0.05,
    newsSensitivity: 1.3,
    baseTrendStrength: 1.2,
  },
  {
    coin: 'TON',
    volatility: 0.06,
    newsSensitivity: 1.4,
    baseTrendStrength: 1.3,
  },
  {
    coin: 'USDC',
    volatility: 0.001,
    newsSensitivity: 0,
    baseTrendStrength: 0,
  },
]

export function getCoinProfile(coin: string): CoinProfile {
  return (
    COIN_PROFILES.find(
      (c) => c.coin.toLowerCase() === coin.toLocaleLowerCase(),
    ) ?? {
      coin,
      volatility: 0.04,
      newsSensitivity: 1.0,
      baseTrendStrength: 1.0,
    }
  )
}
