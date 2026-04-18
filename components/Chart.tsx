'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

export function Chart({
  userHistory = [],
  aiHistory = [],
}: {
  userHistory?: number[]
  aiHistory?: number[]
}) {
  const data = userHistory.map((value, index) => ({
    time: `Month ${index}`,
    user: Number.isFinite(value) ? value : 0,
    ai: Number.isFinite(aiHistory?.[index]) ? aiHistory[index] : 0,
  }))

  const formatter = (value: unknown, name: unknown): [string, string] => {
    const num = Number(value) || 0
    return [`$${num.toLocaleString()}`, String(name)]
  }

  return (
    <div style={{ width: '100%' }}>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' stroke='#333' />

          <XAxis dataKey='time' stroke='#888' />

          <YAxis
            stroke='#888'
            tickFormatter={(value: number) => `$${value.toFixed(0)}`}
          />

          <Tooltip formatter={formatter} />

          <Line
            type='monotone'
            dataKey='user'
            name='User Strategy'
            stroke='#ef4444'
            strokeWidth={2}
            dot={false}
          />

          <Line
            type='monotone'
            dataKey='ai'
            name='AI Strategy'
            stroke='#22c55e'
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
