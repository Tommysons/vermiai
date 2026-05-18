export const COINS = {
  BTC: {
    id: 'bitcoin',
    name: 'Bitcoin',
  },
  ETH: {
    id: 'ethereum',
    name: 'Ethereum',
  },
  SOL: {
    id: 'solana',
    name: 'Solana',
  },
  TON: {
    id: 'the-open-network',
    name: 'The Open Network',
  },
  BNB: {
    id: 'binancecoin',
    name: 'Binance Coin',
  },
  USDC: {
    id: 'usd-coin',
    name: 'USD Coin',
  },
} as const

export type Coin = keyof typeof COINS
