import type { Portfolio } from '@/lib/data/portfolio'
import type { MarketPrices } from '@/lib/market/getMarketPrices'

export function getPortfolioValue(portfolio: Portfolio, prices: MarketPrices) {
  return (
    portfolio.BTC * prices.BTC +
    portfolio.ETH * prices.ETH +
    portfolio.SOL * prices.SOL +
    portfolio.TON * prices.TON +
    portfolio.BNB * prices.BNB +
    portfolio.USDC * prices.USDC
  )
}
