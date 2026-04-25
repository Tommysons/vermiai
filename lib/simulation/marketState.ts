export type MarketCycle = 'bull' | 'bear' | 'crash' | 'recovery'

export const marketState = {
  cycle: 'bull' as MarketCycle,
  dayInclyne: 0,
  volatility: 0.02,
}
