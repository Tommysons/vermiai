import { tickMarket, getMarket } from './marketEngine'
import { getMemoryState, closeTrade } from './aiMemoryEngine'
import { runAIExecution } from './executionEngine'

export function runSimulation(days: number) {
  for (let i = 0; i < days; i++) {
    tickMarket()

    const market = getMarket()
    const memory = getMemoryState()

    runAIExecution()

    for (const trade of memory.trades) {
      if (trade.status !== 'open') continue

      const price = market[trade.coin] ?? trade.entryPrice

      const age = Date.now() - trade.openedAt

      if (age > 3 * 24 * 60 * 60 * 1000 || Math.random() > 0.6) {
        closeTrade(trade.id, price)
      }
    }
  }
}
