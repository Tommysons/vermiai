'use client'

import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type VermiData = {
  income: number
  investment: number
  reinvestRate?: number
  months?: number
}

type Insight = {
  label: 'LOW' | 'MEDIUM' | 'HIGH'
  message: string
  recommendation: string
}

function simulateGrowth(data: VermiData) {
  const months = data.months ?? 12
  const reinvest = data.reinvestRate ?? 0.5

  const monthlyIncome = data.income * 30

  let capital = data.investment
  const history: number[] = []

  for (let i = 0; i < months; i++) {
    const profit = monthlyIncome + capital * 0.02

    const reinvested = profit * reinvest
    const withdrawn = profit * (1 - reinvest)

    capital += reinvested

    history.push(capital + withdrawn)
  }

  return {
    finalCapital: capital,
    history,
  }
}

function calculateScore(finalCapital: number, initial: number, months: number) {
  const growth = finalCapital / initial

  const annualized = Math.pow(growth, 12 / months) - 1

  const score = Math.min(100, Math.max(0, annualized * 100))

  return {
    growth,
    score,
  }
}

function generateInsight(
  score: number,
  growth: number,
  reinvestRate: number,
): Insight {
  if (score > 75 && reinvestRate > 0.6) {
    return {
      label: 'HIGH',
      message: 'Aggressive compounding strategy detected.',
      recommendation: 'Consider reducing reinvestment to stabilize returns.',
    }
  }
  if (score > 50) {
    return {
      label: 'MEDIUM',
      message: 'Balanced growth stradegy.',
      recommendation:
        'You are on a stable path. Slight reinvestment increase could improve results.',
    }
  }
  return {
    label: 'LOW',
    message: 'Weak compounding performance.',
    recommendation:
      'Increase reinvest rate or investment capital to improve growth.',
  }
}

export default function Dashboard() {
  const [data, setData] = useState<VermiData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const saved = localStorage.getItem('vermiai-data')

    if (saved) {
      try {
        const parsed = JSON.parse(saved)

        const safeData = {
          income: Number(parsed.income) || 0,
          investment: Number(parsed.investment) || 0,
          reinvestRate: Number(parsed.reinvestRate) || 0.5,
          months: Number(parsed.months) || 12,
        }

        setData(safeData)
      } catch {
        setData(null)
      }
    }
  }, [])

  if (!mounted) {
    return (
      <main className='min-h-screen bg-black text-white p-8'>
        <h1 className='text-3xl font-bold mb-6'>Dashboard</h1>
        <p className='text-gray-400'>Loading...</p>
      </main>
    )
  }

  if (!data) {
    return (
      <main className='min-h-screen bg-black text-white p-8'>
        <h1 className='text-3xl font-bold mb-6'>Dashboard</h1>

        <p className='text-gray-400 mb-4'>No data yet</p>

        <a
          href='/add'
          className='bg-white text-black px-4 py-2 rounded-lg inline-block'
        >
          Add Data
        </a>
      </main>
    )
  }

  const result = simulateGrowth(data)
  const analysis = calculateScore(
    result.finalCapital,
    data.investment,
    data.months ?? 12,
  )

  const insight = generateInsight(
    analysis.score,
    analysis.growth,
    data.reinvestRate ?? 0.5,
  )

  //Chart data
  const chartData = result.history.map((value, index) => ({
    month: index + 1,
    value: Number.isFinite(value) ? value : 0,
  }))

  const monthlyIncome = data.income * 30
  const roi = data.investment > 0 ? result.finalCapital / data.investment : 0

  let message = ''
  if (analysis.score > 70) message = '🟢 Strong strategy'
  else if (analysis.score > 40) message = '🟡 Moderate'
  else message = '🔴 High risk'

  return (
    <main className='min-h-screen bg-black text-white p-8'>
      <h1 className='text-3xl font-bold mb-6'>Dashboard</h1>

      <a
        href='/add'
        className='bg-white text-black px-4 py-2 rounded-lg inline-block mb-6'
      >
        Add Data
      </a>

      <div className='bg-zinc-900 p-6 rounded-xl mb-6'>
        <p>💰 Income: ${data.income}</p>
        <p>📊 Investment: ${data.investment}</p>
      </div>

      <div className='bg-black border border-zinc-800 p-6 rounded-xl'>
        <p>📈 Monthly Income: ${monthlyIncome}</p>
        <p>📊 ROI: {roi.toFixed(2)}x</p>
        <p>🧠 AI Score: {analysis.score.toFixed(0)} / 100</p>
        <p>{message}</p>
      </div>
      <div className='bg-zinc-950 border border-zinc-800 p-6 rounded-xl mt-6'>
        <p className='text-xl font-bold mb-2'>🧠 AI Insight</p>
        <p className='text-gray-300 mb-2'>{insight.message}</p>
        <p className='text-white font-semibold'>{insight.recommendation}</p>
        <span className='text-sm text-gray-500'>
          Risk level: {insight.label}
        </span>
      </div>
      <div className='bg-zinc-950 border border-zinc-800 p-6 rounded-xl mt-6'>
        <p className='text-xl font-bold mb-4'>📊 Growth Simulation</p>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#333' />
              <XAxis dataKey='month' stroke='#888' />
              <YAxis stroke='#888' />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111',
                  border: '1px solid #333',
                  color: '#fff',
                }}
              />
              <Line
                type='monotone'
                dataKey='value'
                stroke='#22c55e'
                strokeWidth={2}
                strokeLinecap='round'
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  )
}
