'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Snapshot = {
  _id: string
  totalValue: number
  createdAt: string
}

type Props = {
  data: Snapshot[]
}

export default function PortfolioHistoryChart({ data }: Props) {
  const formatted = data.map((item) => ({
    value: item.totalValue,
    time: new Date(item.createdAt).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }))

  return (
    <div className='mt-8 p-5 rounded-2xl bg-zinc-950 border border-zinc-800'>
      <h2 className='text-xl font-semibold text-white mb-4'>
        Portfolio Performance
      </h2>

      <div className='h-72'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={formatted}>
            <XAxis
              dataKey='time'
              tick={{ fontSize: 10 }}
              interval='preserveStartEnd'
            />

            <YAxis tick={{ fontSize: 10 }} />

            <Tooltip
              formatter={(value: any) => {
                const num = Number(value ?? 0)
                return [`$${num.toFixed(2)}`, 'Value']
              }}
            />

            <Line
              type='monotone'
              dataKey='value'
              stroke='#3b82f6'
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
