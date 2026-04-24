'use client'

import { getInvestmentReport } from '@/lib/simulation/investmentEngine'

export default function Dashboard() {
  const report = getInvestmentReport()

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>VermiAI Dashboard</h1>

      {/*Per coin breakdown*/}
      <div className='space-y-3'>
        {report.breakdown.map((item) => (
          <div
            key={item.coin}
            className='flex justify-between p-3 border rounded-xl'
          >
            <div>
              <p className='font-semibold'>{item.coin}</p>
              <p className='text-sm text-gray-500'> APR: {item.apr}%</p>
            </div>
            <div className='text-right'>
              <p>${item.dailyIncome.toFixed(2)} / day</p>
              <p>${item.monthlyIncome.toFixed(2)} / month</p>
            </div>
          </div>
        ))}
      </div>
      {/*Total Stats*/}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4'>
        <div className='p-4 border rounded-xl'>
          <h2 className='text-sm text-gray-500'>Total Daily Income</h2>
          <p className='text-xl font-semibold'>
            ${report.totalDaily.toFixed(2)}
          </p>
        </div>

        <div className='p-4 border rounded-xl'>
          <h2 className='text-sm text-gray-500'>Total Monthly Income</h2>
          <p className='text-xl font-semibold'>
            ${report.totalMonthly.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
