'use client'

import { useState } from 'react'

import { seedTransactions, getTransactions } from '@/lib/data/transactions'
import type { Transaction } from '@/lib/data/transactions'

import { buildPortfolio } from '@/lib/simulation/portfolioEngine'
import type { Investment } from '@/lib/data/investments'

import { getAIAdviceV2 } from '@/lib/simulation/aiAdvisorV2'
import type { AIResult } from '@/lib/simulation/aiAdvisorV2'

import { runAIExecution } from '@/lib/simulation/executionEngine'
import { runSimulation } from '@/lib/simulation/timeEngine'

// -----------------------------
// TYPES
// -----------------------------
type ExecutionResult = {
  executed: boolean
  action?: string
  from?: string
  to?: string
  amount?: number
  reason?: string
}

type SimulationDay = {
  day: number
  portfolio: Investment[]
  value: number
  action: string
  note: string
  execution: ExecutionResult
}

// -----------------------------
// COMPONENT
// -----------------------------
export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<Investment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [ai, setAi] = useState<AIResult | null>(null)
  const [execution, setExecution] = useState<ExecutionResult | null>(null)
  const [simulation, setSimulation] = useState<SimulationDay[]>([])

  // -----------------------------
  // REFRESH
  // -----------------------------
  const refresh = () => {
    setPortfolio(buildPortfolio())
    setTransactions(getTransactions())
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>VermiAI Dashboard</h1>

      {/* ---------------- BUTTONS ---------------- */}
      <div className='flex gap-2 flex-wrap'>
        <button
          className='px-4 py-2 border rounded'
          onClick={() => {
            seedTransactions()
            refresh()
          }}
        >
          Seed Data
        </button>

        <button
          className='px-4 py-2 border rounded'
          onClick={() => {
            const result = getAIAdviceV2()
            setAi(result)
          }}
        >
          Run AI
        </button>

        <button
          className='px-4 py-2 border rounded'
          onClick={() => {
            const result = runAIExecution()
            setExecution(result)
            refresh()
          }}
        >
          Execute AI
        </button>

        <button
          className='px-4 py-2 border rounded bg-blue-100'
          onClick={() => {
            const result = runSimulation(7)
            setSimulation(result)
          }}
        >
          Run 7-day Simulation
        </button>

        <button className='px-4 py-2 border rounded' onClick={refresh}>
          Refresh
        </button>
      </div>

      {/* ---------------- PORTFOLIO ---------------- */}
      <div className='border p-3 rounded'>
        <h2 className='font-bold mb-2'>Portfolio</h2>
        <pre>{JSON.stringify(portfolio, null, 2)}</pre>
      </div>

      {/* ---------------- TRANSACTIONS ---------------- */}
      <div className='border p-3 rounded'>
        <h2 className='font-bold mb-2'>Transactions</h2>
        <pre>{JSON.stringify(transactions, null, 2)}</pre>
      </div>

      {/* ---------------- AI ---------------- */}
      <div className='border p-3 rounded'>
        <h2 className='font-bold mb-2'>AI Decision</h2>
        <pre>{JSON.stringify(ai, null, 2)}</pre>
      </div>

      {/* ---------------- EXECUTION ---------------- */}
      <div className='border p-3 rounded'>
        <h2 className='font-bold mb-2'>Execution</h2>
        <pre>{JSON.stringify(execution, null, 2)}</pre>
      </div>

      {/* ---------------- SIMULATION ---------------- */}
      <div className='border p-3 rounded'>
        <h2 className='font-bold mb-2'>Simulation</h2>

        {simulation.length === 0 && (
          <p className='text-gray-500'>No simulation yet</p>
        )}

        {simulation.map((day) => (
          <div key={day.day} className='border p-2 rounded mb-2'>
            <p>
              <strong>Day {day.day}</strong>
            </p>
            <p>Value: ${day.value.toFixed(2)}</p>
            <p>Action: {day.action}</p>
            <p>Note: {day.note}</p>

            {day.execution?.executed && (
              <p className='text-green-600'>
                Executed: {day.execution.from} → {day.execution.to} ($
                {day.execution.amount})
              </p>
            )}

            <details>
              <summary className='cursor-pointer text-sm text-gray-500'>
                View Portfolio
              </summary>
              <pre>{JSON.stringify(day.portfolio, null, 2)}</pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}
