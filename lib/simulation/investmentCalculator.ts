import { getAPR } from '../data/apr'

export type Investment = {
  coin: string
  amount: number
}

export type InvestmentResult = {
  coin: string
  investment: number
  apr: number
  dailyIncome: number
  monthlyIncome: number
}

export function calculateInvestmentIncome(
  investments: Investment[],
): InvestmentResult[] {
  return investments.map((inv) => {
    const apr = getAPR(inv.coin)

    const dailyIncome = (inv.amount * apr) / 100 / 365
    const monthlyIncome = dailyIncome * 30

    return {
      coin: inv.coin,
      investment: inv.amount,
      apr,
      dailyIncome,
      monthlyIncome,
    }
  })
}
