'use client'

import { calculateInvestmentIncome } from '@/lib/simulation/investmentCalculator'

export default function Test() {
  const investments = [
    { coin: 'BTC', amount: 1000 },
    { coin: 'USDC', amount: 1000 },
  ]

  const result = calculateInvestmentIncome(investments)
  console.log('TEST')
  console.log(result)
  return <div>Check console</div>
}
