import { getMarket } from './marketEngine'
import { getOpenTrades, closeTrade } from './tradeLifecycle'

// -----------------------------
// AUTO TRADE CLOSER (SAFE VERSION)
// -----------------------------
// closes trades after simulated time passes
// and calculates PnL via exitPrice

export function closeOldTrades() {
  const market = getMarket()
  const openTrades = getOpenTrades()

  const now = Date.now()

  const CLOSE_AFTER = 3 * 24 * 60 * 60 * 1000 // 3 simulated days

  for (const trade of openTrades) {
    if (!trade.entryPrice) continue // safety guard

    const age = now - trade.openedAt

    if (age > CLOSE_AFTER) {
      const exitPrice =
        typeof market[trade.coin] === 'number'
          ? market[trade.coin]
          : trade.entryPrice

      closeTrade(trade.id, exitPrice)
    }
  }
}
