import { getAIAdviceV2 } from './aiAdvisorV2'
import { buildPortfolio } from './portfolioEngine'
import { addTransaction } from '../data/transactions'

export function runAIExecution() {
  const ai = getAIAdviceV2()
  const portfolio = buildPortfolio()

  if (ai.action === 'swap' && ai.fromCoin && ai.toCoin) {
    const fromCoin = ai.fromCoin
    const toCoin = ai.toCoin

    const from = portfolio.find(
      (i) => i.coin.toUpperCase() === fromCoin.toUpperCase(),
    )

    if (!from || from.amount <= 0) {
      return { executed: false, reason: 'Invalid source coin or amount' }
    }

    const amount = from.amount
    const now = new Date().toISOString()

    //write transaction instead of modifying state
    addTransaction({
      type: 'swap',
      from: fromCoin,
      to: toCoin,
      amount,
      date: now,
    })

    return {
      executed: true,
      action: ai.action,
      from: fromCoin,
      to: toCoin,
      amount,
    }
  }

  return {
    executed: false,
    action: ai.action,
    reason: ai.reason,
  }
}
