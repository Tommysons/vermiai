export type Investment = {
  coin: string
  amount: number
}

let investments: Investment[] = [
  { coin: 'BTC', amount: 1000 },
  { coin: 'USDC', amount: 1000 },
]

//GET
export function getInvestments(): Investment[] {
  return investments
}

//ADD
export function addInvestment(inv: Investment) {
  const existing = investments.find((i) => i.coin === inv.coin)

  if (existing) {
    existing.amount += inv.amount
  } else {
    investments.push(inv)
  }
}

//Reset
export function resetInvestments() {
  investments = []
}
