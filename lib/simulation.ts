export type VermiData = {
  income: number
  investment: number
  reinvestAmount?: number
  months?: number
  withdrawal?: number
}

export type SimulationResult = {
  history: number[]
  finalCapital: number
  totalDeposits: number
  totalWithdrawals: number
  totalProfit: number
  roi: number
  score: number
}

export function calculateScore(
  finalCapital: number,
  initial: number,
  months: number,
) {
  if (!initial || initial <= 0 || !Number.isFinite(finalCapital)) {
    return { growth: 0, score: 0 }
  }

  const growth = finalCapital / initial
  const annualized = Math.pow(growth, 12 / Math.max(months, 1)) - 1

  const score = Math.min(100, Math.max(0, annualized * 100))

  return { growth, score }
}

export function simulate(data: VermiData) {
  const months = data.months ?? 12

  const income = Number(data.income) || 0
  const investment = Number(data.investment) || 0
  const reinvestAmount = Number(data.reinvestAmount) || 0
  const withdrawal = Number(data.withdrawal) || 0

  const monthlyIncome = income * 30

  let capital = investment
  let totalDeposits = investment

  const history: number[] = [capital]

  for (let i = 0; i < months; i++) {
    // 1. income comes in
    const cashflow = monthlyIncome

    // 2. capital earns small growth (optional engine)
    const interest = capital * 0.01

    // 3. total earnings
    const profit = cashflow + interest

    // 4. reinvest limited amount
    const reinvested = Math.min(profit, reinvestAmount)

    // 5. APPLY WITHDRAWAL (IMPORTANT FIX)
    const netWithdrawal = withdrawal

    // 6. update capital
    capital += reinvested
    capital -= netWithdrawal

    // 7. track deposits
    totalDeposits += cashflow

    // 8. prevent negative crash
    if (capital < 0) capital = 0

    history.push(capital)
  }

  const totalProfit = capital - totalDeposits
  const roi = totalDeposits > 0 ? capital / totalDeposits : 0
  const score = Math.min(100, Math.max(0, (roi - 1) * 100))

  return {
    history,
    finalCapital: capital,
    totalDeposits,
    totalProfit,
    roi,
    score,
  }
}
