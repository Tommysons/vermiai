'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

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
  return (
    <div className='mt-6 p-5 rounded-2xl bg-zinc-950 border border-zinc-800'>
      <h2 className='text-xl font-semibold mb-4'>Portfolio Allocation</h2>

      <div className='h-80 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            {/* PIE (clean, no labels inside) */}
            <Pie
              data={data}
              dataKey='value'
              nameKey='name'
              outerRadius={90}
              innerRadius={55} // makes donut look nicer
              stroke='#111'
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            {/* TOOLTIP */}
            <Tooltip
              formatter={(value) => `$${Number(value ?? 0).toFixed(2)}`}
            />

            {/* SIDE LEGEND (THIS IS WHAT YOU WANT) */}
            <Legend
              verticalAlign='middle'
              align='right'
              layout='vertical'
              formatter={(value, entry) => {
                const item = data.find((d) => d.name === value)
                const total = data.reduce((sum, i) => sum + i.value, 0)
                const percent =
                  total > 0 && item
                    ? ((item.value / total) * 100).toFixed(1)
                    : '0.0'

                return `${value} — ${percent}%`
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
