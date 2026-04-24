import { getTransactions } from '../data/transactions'

type Portfolio = {
  coin: string
  amount: number
}

export function buildPortfolio(): Portfolio[] {
  const txs = getTransactions()

  const map: Record<string, number> = {}

  for (const tx of txs) {
    if (tx.type === 'buy' || tx.type === 'earn') {
      const coin = tx.coin.toUpperCase()
      map[coin] = (map[coin] || 0) + tx.amount
    }

    if (tx.type === 'swap') {
      const from = tx.from.toUpperCase()
      const to = tx.to.toUpperCase()

      map[from] = (map[from] || 0) - tx.amount
      map[to] = (map[to] || 0) + tx.amount
    }
  }

  return Object.entries(map)

    .filter(([, amount]) => amount > 0.0001)
    .map(([coin, amount]) => ({ coin, amount }))
}
