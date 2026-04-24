import { getInvestments } from '../data/investments'
import { calculateInvestmentIncome } from './investmentCalculator'

export function getInvestmentReport() {
  const investments = getInvestments()

  const breakdown = calculateInvestmentIncome(investments)

  const totalDaily = breakdown.reduce((sum, i) => sum + i.dailyIncome, 0)
  const totalMonthly = breakdown.reduce((sum, i) => sum + i.monthlyIncome, 0)

  return { breakdown, totalDaily, totalMonthly }
}
