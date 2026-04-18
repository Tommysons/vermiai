export type AssetType = 'miner' | 'earn' | 'crypto' | 'stable'

export type Asset = {
  id: string
  type: AssetType

  value: number

  // mining system
  computingPower?: number // TH
  energyEfficiency?: number // W/TH

  // investment system
  apr: number
}

export type Event =
  | { type: 'deposit'; month: number; amount: number }
  | { type: 'withdraw'; month: number; amount: number }
  | { type: 'buy'; month: number; asset: Asset }
  | { type: 'sell'; month: number; assetId: string }

export type PortfolioAsset = Asset & {
  ownedValue: number
  cost: number
}

export type MaintenanceConfig = {
  tokenDiscount: number
  streakDiscount: number
  vipDiscount: number
}

export type SimulationResult = {
  history: number[]
  incomeHistory: number[]
  finalCapital: number
}
