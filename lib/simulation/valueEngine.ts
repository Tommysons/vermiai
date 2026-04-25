import { buildPortfolio } from './portfolioEngine'
import { getMarket } from './marketEngine'

export function getPortfolioValue() {
  const portfolio = buildPortfolio()
  const market = getMarket()
  let total = 0

  for (const p of portfolio) {
    const price = market[p.coin] || 0
    total += p.amount * price
  }

  return total
}
