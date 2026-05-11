export type Portfolio = {
  BTC: number
  ETH: number
  SOL: number
  TON: number
  BNB: number
  GOMINING?: number
  USDC: number
}

export type PortfolioInputs = {
  BTC: string
  ETH: string
  SOL: string
  TON: string
  BNB: string
  GOMINING?: string
  USDC: string
}

export type Coin = keyof PortfolioInputs
