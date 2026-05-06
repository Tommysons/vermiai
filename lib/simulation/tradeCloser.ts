import { getMarket } from './marketEngine'
import { getOpenTrades, closeTrade } from './tradeLifecycle'
import { recordTrade } from './aiMemoryEngine'

// -----------------------------
// CONFIG
// -----------------------------
const CLOSE_AFTER = 3 * 24 * 60 * 60 * 1000 // 3 days

// base multipliers
const BASE_STOP_LOSS = -0.04 // -4%
const BASE_TAKE_PROFIT = 0.06 // +6%

// -----------------------------
// VOLATILITY (must match marketEngine logic idea)
// -----------------------------
function getCoinVolatility(coin: string): number {
  switch (coin) {
    case 'BTC':
      return 0.02
    case 'ETH':
      return 0.03
    case 'BNB':
      return 0.035
    case 'SOL':
      return 0.06
    case 'TON':
      return 0.07
    case 'USDC':
      return 0.001
    default:
      return 0.05
  }
}

// -----------------------------
// DYNAMIC RISK-BASED SL/TP
// -----------------------------
function getDynamicLevels(coin: string) {
  const vol = getCoinVolatility(coin)

  // scale risk exposure
  const stopLoss = BASE_STOP_LOSS * (1 + vol * 3)
  const takeProfit = BASE_TAKE_PROFIT * (1 + vol * 3)

  return {
    stopLoss,
    takeProfit,
  }
}

// -----------------------------
// AUTO TRADE CLOSER + LEARNING
// -----------------------------
export function closeOldTrades() {
  const market = getMarket()
  const openTrades = getOpenTrades()

  const now = Date.now()

  for (const trade of openTrades) {
    if (trade.status !== 'open') continue

    const age = now - trade.openedAt
    const currentPrice = market[trade.coin] ?? trade.entryPrice

    // -----------------------------
    // PnL calculation
    // -----------------------------
    const pnl =
      trade.entryPrice > 0
        ? (currentPrice - trade.entryPrice) / trade.entryPrice
        : 0

    // -----------------------------
    // DYNAMIC LEVELS
    // -----------------------------
    const { stopLoss, takeProfit } = getDynamicLevels(trade.coin)

    let shouldClose = false
    let reason = ''

    // -----------------------------
    // STOP LOSS
    // -----------------------------
    if (pnl <= stopLoss) {
      shouldClose = true
      reason = 'stop_loss'
    }

    // -----------------------------
    // TAKE PROFIT
    // -----------------------------
    else if (pnl >= takeProfit) {
      shouldClose = true
      reason = 'take_profit'
    }

    // -----------------------------
    // TIME EXIT
    // -----------------------------
    else if (age > CLOSE_AFTER) {
      shouldClose = true
      reason = 'time_exit'
    }

    if (!shouldClose) continue

    // -----------------------------
    // CLOSE TRADE
    // -----------------------------
    closeTrade(trade.id, currentPrice)

    // -----------------------------
    // LEARNING RECORD
    // -----------------------------
    recordTrade({
      id: trade.id,
      coin: trade.coin,
      action: trade.action,
      amount: trade.amount,
      entryPrice: trade.entryPrice,
      exitPrice: currentPrice,
      pnl,
      timestamp: now,
    })

    console.log(
      `[TRADE CLOSED] ${trade.coin} | ${reason} | PnL ${(pnl * 100).toFixed(2)}%`,
    )
  }
}
