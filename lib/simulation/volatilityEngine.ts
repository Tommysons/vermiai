import { getMarket } from './marketEngine'
import { getOpenTrades, closeTrade } from './tradeLifecycle'
import { recordTrade } from './aiMemoryEngine'

const CLOSE_AFTER = 3 * 24 * 60 * 60 * 1000

function getCoinVolatility(coin: string): number {
  switch (coin) {
    case 'BTC':
      return 0.02
    case 'ETH':
      return 0.03
    case 'SOL':
      return 0.06
    default:
      return 0.05
  }
}

function getDynamicLevels(coin: string) {
  const vol = getCoinVolatility(coin)

  return {
    stopLoss: -0.04 * (1 + vol * 3),
    takeProfit: 0.06 * (1 + vol * 3),
  }
}

export function closeOldTrades() {
  const market = getMarket()
  const openTrades = getOpenTrades()
  const now = Date.now()

  for (const trade of openTrades) {
    const currentPrice = market[trade.coin] ?? trade.entryPrice

    const pnl =
      trade.entryPrice > 0
        ? (currentPrice - trade.entryPrice) / trade.entryPrice
        : 0

    const { stopLoss, takeProfit } = getDynamicLevels(trade.coin)

    const age = now - trade.openedAt

    let shouldClose = false
    let reason = ''

    if (pnl <= stopLoss) {
      shouldClose = true
      reason = 'stop_loss'
    } else if (pnl >= takeProfit) {
      shouldClose = true
      reason = 'take_profit'
    } else if (age > CLOSE_AFTER) {
      shouldClose = true
      reason = 'time_exit'
    }

    if (!shouldClose) continue

    closeTrade(trade.id, currentPrice)

    // OPTIONAL: learning record (safe version)
    recordTrade({
      id: trade.id,
      coin: trade.coin,
      action: trade.action,
      amount: trade.amount,
      entryPrice: trade.entryPrice,
      exitPrice: currentPrice,
      openedAt: trade.openedAt,
    })

    console.log(
      `[CLOSED] ${trade.coin} | ${reason} | ${(pnl * 100).toFixed(2)}%`,
    )
  }
}
