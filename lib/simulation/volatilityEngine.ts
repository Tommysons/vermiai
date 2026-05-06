import { getMarketHistory } from './marketEngine'

export function getVolatility(coin: string): number {
  const history = getMarketHistory(coin)

  if (!history || history.length < 2) return 0.02 //default 2%

  const prices = history.map((p) => p.price)

  const high = Math.max(...prices)
  const low = Math.min(...prices)
  const current = prices[prices.length - 1]

  if (current === 0) return 0.02

  return (high - low) / current
}
