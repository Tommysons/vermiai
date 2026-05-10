import { getAIAdviceV2 } from './aiAdvisorV2'
import { buildPortfolio } from './portfolioEngine'
import { addTransaction } from '../data/transactions'
import { closeTrade, getMemoryState, recordTrade } from './aiMemoryEngine'
import { getMarket, tickMarket } from './marketEngine'

let lastActionKey: string | null = null
let lastTick = 0

export function runAIExecution() {
  tickMarket()

  const ai = getAIAdviceV2()
  const portfolio = buildPortfolio()
  const market = getMarket()

  const now = Date.now()

  const actionKey = `${ai.action}-${ai.fromCoin ?? ''}-${ai.toCoin ?? ''}`

  if (lastActionKey === actionKey && now - lastTick < 10000) {
    return { executed: false }
  }

  lastActionKey = actionKey
  lastTick = now

  if (ai.action !== 'swap' || !ai.fromCoin || !ai.toCoin) {
    return { executed: false }
  }

  const from = portfolio.find((p) => p.coin === ai.fromCoin)
  if (!from) return { executed: false }

  const amount = from.amount * 0.25

  const entryPrice = market[ai.toCoin] ?? 1

  const memory = getMemoryState()

  const openTrade = memory.trades
    .slice()
    .reverse()
    .find((t) => t.coin === ai.fromCoin && t.status === 'open')

  if (openTrade) {
    closeTrade(openTrade.id, market[ai.fromCoin] ?? 1)
  }

  recordTrade({
    id: crypto.randomUUID(),
    coin: ai.toCoin,
    amount,
    entryPrice,
    openedAt: now,
    action: 'swap',
  })

  addTransaction({
    type: 'swap',
    from: ai.fromCoin,
    to: ai.toCoin,
    amount,
    date: new Date().toISOString(),
  })

  return { executed: true }
}
