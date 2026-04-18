export type VermiData = {
  income: number
  investment: number
  reinvestAmount?: number
  months?: number
  withdrawal?: number
}

export type ChartPoint = {
  time: string
  user: number
  ai: number
}
export type SimulationResult = {
  history: ChartPoint[]
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

export function simulate(data: VermiData): SimulationResult {
  const months = data.months ?? 12

  const income = Number(data.income) || 0
  const investment = Number(data.investment) || 0
  const reinvestAmount = Number(data.reinvestAmount) || 0
  const withdrawal = Number(data.withdrawal) || 0

  const monthlyIncome = income * 30

  // 👇 TWO SYSTEMS
  let userCapital = investment
  let aiCapital = investment

  const totalDeposits = investment
  let totalWithdrawals = 0

  const history: ChartPoint[] = []

  for (let i = 0; i < months; i++) {
    // =========================
    // 👤 USER STRATEGY
    // =========================
    const userCashflow = monthlyIncome
    const userInterest = userCapital * 0.01
    const userProfit = userCashflow + userInterest

    const userReinvested = Math.min(userProfit, reinvestAmount)
    const userWithdrawable = userProfit - userReinvested
    const userWithdrawal = Math.min(withdrawal, userWithdrawable)

    userCapital += userReinvested
    userCapital -= userWithdrawal

    // =========================
    // 🤖 AI STRATEGY (smarter)
    // =========================
    const aiCashflow = monthlyIncome
    const aiInterest = aiCapital * 0.015 // slightly better compounding
    const aiProfit = aiCashflow + aiInterest

    const aiReinvested = aiProfit * 0.8 // AI reinvests more efficiently
    const aiWithdrawal = aiProfit * 0.1 // AI keeps growth focus

    aiCapital += aiReinvested
    aiCapital -= aiWithdrawal

    // =========================
    // SAFETY
    // =========================
    if (userCapital < 0) userCapital = 0
    if (aiCapital < 0) aiCapital = 0

    totalWithdrawals += userWithdrawal + aiWithdrawal

    // =========================
    // HISTORY
    // =========================
    history.push({
      time: `Month ${i}`,
      user: userCapital,
      ai: aiCapital,
    })
  }

  const finalCapital = Math.max(userCapital, aiCapital)

  const totalProfit = finalCapital + totalWithdrawals - totalDeposits

  const roi =
    totalDeposits > 0 ? (finalCapital - totalDeposits) / totalDeposits : 0

  const { score } = calculateScore(finalCapital, investment, months)

  return {
    history,
    finalCapital,
    totalDeposits,
    totalWithdrawals,
    totalProfit,
    roi,
    score,
  }
}
