'use client'

import { useEffect, useState } from 'react'
import { simulate, calculateScore, VermiData } from '@/lib/simulation'
import { generateInsight } from '@/lib/ai'
import { Chart } from '@/components/Chart'

export default function Dashboard() {
  const [data, setData] = useState<VermiData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const saved = localStorage.getItem('vermiai-data')

    if (saved) {
      try {
        setData(JSON.parse(saved))
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

  // SAFE INPUTS
  const safeData: VermiData = {
    income: Number(data.income) || 0,
    investment: Number(data.investment) || 0,
    months: data.months ?? 12,
    reinvestAmount: Number(data.reinvestAmount) || 0,
    withdrawal: Number(data.withdrawal) || 0,
  }

  // CORE SIMULATION
  const result = simulate(safeData)

  const analysis = calculateScore(
    result.finalCapital,
    safeData.investment,
    safeData.months ?? 12,
  )

  const insight = generateInsight(
    analysis.score,
    analysis.growth,
    0, // reinvestAmount replaced logic, so no % needed
  )

  // DERIVED VALUES
  const monthlyIncome = safeData.income * 30

  const roiPercent =
    result.totalDeposits > 0
      ? ((result.finalCapital - result.totalDeposits) / result.totalDeposits) *
        100
      : 0

  const message =
    analysis.score > 70
      ? '🟢 Strong strategy'
      : analysis.score > 40
        ? '🟡 Moderate'
        : '🔴 High risk'

  //History
  const userHistory = result.history.map((h) => h.user)
  const aiHistory = result.history.map((h) => h.ai)

  return (
    <main className='min-h-screen bg-black text-white p-8'>
      <h1 className='text-3xl font-bold mb-6'>Dashboard</h1>

      <a
        href='/add'
        className='bg-white text-black px-4 py-2 rounded-lg inline-block mb-6'
      >
        Add Data
      </a>

      {/* USER DATA */}
      <div className='bg-zinc-900 p-6 rounded-xl mb-6'>
        <p>💰 Daily Income: ${safeData.income}</p>
        <p>📊 Investment: ${safeData.investment}</p>
        <p>💸 Withdrawal: ${safeData.withdrawal}</p>
      </div>

      {/* METRICS */}
      <div className='bg-black border border-zinc-800 p-6 rounded-xl mb-6'>
        <p>📈 Monthly Income: ${monthlyIncome.toFixed(2)}</p>
        <p>📊 ROI: {roiPercent.toFixed(2)}%</p>
        <p>🧠 AI Score: {analysis.score.toFixed(0)} / 100</p>
        <p>{message}</p>
      </div>

      {/* CHART */}
      <div className='bg-zinc-950 border border-zinc-800 p-6 rounded-xl mb-6'>
        <p className='text-xl font-bold mb-4'>📊 Growth Simulation</p>
        <Chart userHistory={userHistory} aiHistory={aiHistory} />
      </div>

      {/* AI INSIGHT */}
      <div className='bg-zinc-950 border border-zinc-800 p-6 rounded-xl'>
        <p className='text-xl font-bold mb-2'>🧠 AI Insight</p>
        <p className='text-gray-300 mb-2'>{insight.message}</p>
        <p className='text-white font-semibold'>{insight.recommendation}</p>
        <span className='text-sm text-gray-500'>
          Risk level: {insight.label}
        </span>
      </div>
    </main>
  )
}
