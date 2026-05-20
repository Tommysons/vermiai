'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

type ChartItem = {
  name: string
  value: number
}

type Props = {
  data: ChartItem[]
}

const COLORS = [
  '#f7931a',
  '#ef4444',
  '#00ffa3',
  '#0098ea',
  '#f3ba2f',
  '#2775ca',
]

export default function PortfolioChart({ data }: Props) {
  const total = data.reduce((sum, i) => sum + i.value, 0)

  return (
    <div className='mt-6 p-5 rounded-2xl bg-zinc-950 border border-zinc-800'>
      <h2 className='text-xl font-semibold mb-4'>Portfolio Allocation</h2>

      <div className='flex items-center'>
        {/* PIE */}
        <div className='w-1/2 h-72'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                dataKey='value'
                nameKey='name'
                outerRadius={90}
                innerRadius={55}
                stroke='#111'
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => `$${Number(value ?? 0).toFixed(2)}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* SIDE LEGEND (CUSTOM — MUCH BETTER) */}
        <div className='w-1/2 space-y-3'>
          {data.map((item, index) => {
            const percent = total > 0 ? (item.value / total) * 100 : 0

            return (
              <div
                key={item.name}
                className='flex items-center justify-between'
              >
                {/* LEFT: COLOR + NAME */}
                <div className='flex items-center gap-2'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{
                      background: COLORS[index % COLORS.length],
                    }}
                  />
                  <span className='text-white'>{item.name}</span>
                </div>

                {/* RIGHT: % */}
                <span className='text-gray-400 text-sm'>
                  {percent.toFixed(1)}%
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
