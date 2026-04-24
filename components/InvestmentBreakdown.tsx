'use client'

import { calculateInvestmentIncome } from '@/lib/simulation/investmentCalculator'

type Props = {
  investments: {
    coin: string
    amount: number
  }[]
}

export default function InvestmentBreakdown({ investments }: Props) {
  const result = calculateInvestmentIncome(investments)

  const totalDaily = result.reduce((sum, r) => sum + r.dailyIncome, 0)
  const totalMonthly = result.reduce((sum, r) => sum + r.monthlyIncome, 0)

  return (
    <div className='p-4 space-y-4'>
      {/* Per coin*/}
      <div className='space-y-2'>
        {result.map((item) => (
          <div key={item.coin} className='flex justify-between'>
            <span>{item.coin}</span>

            <span>
              ${item.dailyIncome.toFixed(2)} / day | $
              {item.monthlyIncome.toFixed(2)} / month
            </span>
          </div>
        ))}
      </div>

      {/*Total*/}
      <div className='border-t pt-3 font-bold flex justify-between'>
        <span>Total</span>
        <span>
          ${totalDaily.toFixed(2)} / day | ${totalMonthly.toFixed(2)} / month
        </span>
      </div>
    </div>
  )
}
