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
  BTC: number
  ETH: number
  SOL: number
  TON: number
  BNB: number
  GOMINING?: number
  USDC: number
}

export type Coin = keyof PortfolioInputs
