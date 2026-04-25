export type RiskLevel = 'low' | 'medium' | 'high' | 'stable'

export function getRiskLevel(coin: string): RiskLevel {
  const c = coin.toUpperCase()

  switch (c) {
    case 'BTC':
      return 'low'
    case 'ETH':
      return 'medium'
    case 'BNB':
      return 'medium'
    case 'SOL':
    case 'TON':
      return 'high'
    case 'USDC':
      return 'stable'
    default:
      return 'high'
  }
}

export function getRiskPenalty(coin: string): number {
  const level = getRiskLevel(coin)

  switch (level) {
    case 'stable':
      return 0
    case 'low':
      return 0.1
    case 'medium':
      return 0.25
    case 'high':
      return 0.5
    default:
      return 0.5
  }
}
