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

export function Chart({ history }: { history: number[] }) {
  const data = history.map((value, index) => ({
    time: index, // can be week/month step
    value: Number.isFinite(value) ? value : 0,
  }))

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' stroke='#333' />

          <XAxis dataKey='time' stroke='#888' tickFormatter={(v) => `t${v}`} />

          <YAxis stroke='#888' />

          <Tooltip
            contentStyle={{
              backgroundColor: '#111',
              border: '1px solid #333',
              color: '#fff',
            }}
            formatter={(value: any) => {
              const num = Number(value) || 0
              return [`$${num.toFixed(2)}`, 'Capital']
            }}
          />

          <Line
            type='monotone'
            dataKey='value'
            stroke='#22c55e'
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
