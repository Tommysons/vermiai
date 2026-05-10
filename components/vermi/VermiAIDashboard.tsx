'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts'

import { buildPortfolio } from '@/lib/simulation/portfolioEngine'
import { getMarket } from '@/lib/simulation/marketEngine'
import { getAIAdviceV2 } from '@/lib/simulation/aiAdvisorV2'
import { runAIExecution } from '@/lib/simulation/executionEngine'
import { runSimulation } from '@/lib/simulation/timeEngine'

import {
  getPerformanceReport,
  getEquityCurve,
  getDrawdownCurve,
} from '@/lib/simulation/performanceEngine'

import { seedTransactions } from '@/lib/data/transactions'

type EquityPoint = {
  step: number
  equity: number
}

type DrawdownPoint = {
  step: number
  drawdown: number
}

export default function VermiAIDashboard() {
  const [refresh, setRefresh] = useState(0)

  // -----------------------------
  // INIT
  // -----------------------------
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seeded = localStorage.getItem('vermi_seeded')

      if (!seeded) {
        localStorage.removeItem('vermi_ai_memory')
        localStorage.removeItem('vermi_trade_lifecycle')

        seedTransactions()
        localStorage.setItem('vermi_seeded', 'true')
      }
    }

    const interval = setInterval(() => {
      runAIExecution()
      runSimulation(1)
      setRefresh((p) => p + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // -----------------------------
  // DATA
  // -----------------------------
  const portfolio = useMemo(() => buildPortfolio(), [refresh])
  const market = getMarket()
  const ai = useMemo(() => getAIAdviceV2(), [refresh])

  const performance = useMemo(() => {
    const data = getPerformanceReport()

    return {
      trades: data.trades ?? 0,
      totalPnL: data.totalPnL ?? 0,
      winRate: data.winRate ?? 0,
      sharpe: data.sharpe ?? 0,
      maxDrawdown: data.maxDrawdown ?? 0,
      avgWin: data.avgWin ?? 0,
      avgLoss: data.avgLoss ?? 0,
    }
  }, [refresh])

  const equityCurve = useMemo(() => getEquityCurve(), [refresh])
  const drawdownCurve = useMemo(() => getDrawdownCurve(), [refresh])

  // DEBUG (IMPORTANT — you MUST see this)
  useEffect(() => {
    console.log('EQUITY:', equityCurve)
    console.log('DRAWDOWN:', drawdownCurve)
    console.log('PERFORMANCE:', performance)
  }, [equityCurve, drawdownCurve, performance])

  // -----------------------------
  // CHART DATA
  // -----------------------------
  const safeEquity = equityCurve.length ? equityCurve : [0]

  const equityData = safeEquity.map((v, i) => ({
    step: i,
    equity: Number(v.toFixed?.(2) ?? 0),
  }))

  const drawdownData: DrawdownPoint[] = drawdownCurve.map((v, i) => ({
    step: i,
    drawdown: Number((v * 100).toFixed(2)),
  }))

  // -----------------------------
  // PORTFOLIO VALUE
  // -----------------------------
  const totalValue = portfolio.reduce((sum, p) => {
    const price = market[p.coin] ?? 1
    return sum + p.amount * price
  }, 0)

  function handleRunAI() {
    runAIExecution()
    setRefresh((p) => p + 1)
  }

  function handleSimulation() {
    runSimulation(30)
    setRefresh((p) => p + 1)
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className='min-h-screen bg-black text-white p-6'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* HEADER */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-4xl font-bold'>VermiAI Dashboard</h1>
            <p className='text-zinc-400'>AI portfolio simulation system</p>
          </div>

          <div className='flex gap-3'>
            <button
              onClick={handleRunAI}
              className='bg-blue-600 px-4 py-2 rounded-xl'
            >
              Run AI
            </button>

            <button
              onClick={handleSimulation}
              className='bg-green-600 px-4 py-2 rounded-xl'
            >
              Run 30d Simulation
            </button>
          </div>
        </div>

        {/* METRICS */}
        <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
          <MetricCard
            title='Portfolio Value'
            value={`$${totalValue.toFixed(2)}`}
          />
          <MetricCard
            title='PnL'
            value={`${(performance.totalPnL * 100).toFixed(2)}%`}
          />
          <MetricCard
            title='Win Rate'
            value={`${(performance.winRate * 100).toFixed(1)}%`}
          />
          <MetricCard title='Sharpe' value={performance.sharpe.toFixed(2)} />
          <MetricCard
            title='Max DD'
            value={`${(performance.maxDrawdown * 100).toFixed(2)}%`}
          />
        </div>
        <div className='bg-zinc-900 p-4 rounded-xl text-xs'>
          <h2 className='text-white mb-2'>DEBUG DATA</h2>

          <pre className='text-green-400 overflow-auto'>
            {JSON.stringify(
              {
                portfolio,
                market,
                equityCurve,
                drawdownCurve,
                performance,
              },
              null,
              2,
            )}
          </pre>
        </div>

        {/* CHARTS */}
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
          {/* EQUITY */}
          <div className='bg-zinc-900 p-4 rounded-xl'>
            <h2 className='mb-2'>Equity Curve</h2>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={equityData}>
                <CartesianGrid stroke='#222' />
                <XAxis dataKey='step' />
                <YAxis />
                <Tooltip />
                <Line type='monotone' dataKey='equity' stroke='#00ff99' />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* DRAWDOWN */}
          <div className='bg-zinc-900 p-4 rounded-xl'>
            <h2 className='mb-2'>Drawdown</h2>
            <ResponsiveContainer width='100%' height={300}>
              <AreaChart data={drawdownData}>
                <CartesianGrid stroke='#222' />
                <XAxis dataKey='step' />
                <YAxis />
                <Tooltip />
                <Area dataKey='drawdown' fill='#ff4444' stroke='#ff4444' />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI PANEL */}
        <div className='bg-zinc-900 p-4 rounded-xl'>
          <h2>AI Decision</h2>
          <p>
            Action: <b>{ai.action}</b>
          </p>
          <p>Reason: {ai.reason}</p>
          <p>Confidence: {(ai.confidence * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className='bg-zinc-900 p-4 rounded-xl'>
      <div className='text-sm text-zinc-400'>{title}</div>
      <div className='text-2xl font-bold'>{value}</div>
    </div>
  )
}
