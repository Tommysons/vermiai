'use client'

import { Chart } from './Chart'

export function StrategyCard({
  name,
  reinvestAmount,
  history,
  score,
}: {
  name: string
  reinvestAmount: number
  history: number[]
  score: number
}) {
  return (
    <div className='bg-zinc-950 border border-zinc-800 p-4 rounded-xl'>
      <p className='font-bold text-lg mb-2'>{name}</p>

      <p className='text-sm text-gray-400 mb-2'>
        Reinvest: ${reinvestAmount.toFixed(2)} / month
      </p>

      <Chart history={history} />

      <p className='mt-2 text-sm'>🧠 Score: {score.toFixed(0)}</p>
    </div>
  )
}
