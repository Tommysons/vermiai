'use client'

import { useState } from 'react'

import { seedTransactions, getTransactions } from '@/lib/data/transactions'
import type { Transaction } from '@/lib/data/transactions'

import { buildPortfolio } from '@/lib/simulation/portfolioEngine'
import type { Investment } from '@/lib/data/investments'

import { getAIAdviceV2 } from '@/lib/simulation/aiAdvisorV2'
import type { AIResult } from '@/lib/simulation/aiAdvisorV2'

import { runAIExecution } from '@/lib/simulation/executionEngine'

export default function Dashboard() {
  // -----------------------------
  // STATE (fully typed)
  // -----------------------------
  const [portfolio, setPortfolio] = useState<Investment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [ai, setAi] = useState<AIResult | null>(null)

  const [execution, setExecution] = useState<{
    executed: boolean
    action?: string
    from?: string
    to?: string
    amount?: number
    reason?: string
  } | null>(null)

  // -----------------------------
  // REFRESH DATA
  // -----------------------------
  const refresh = () => {
    setPortfolio(buildPortfolio())
    setTransactions(getTransactions())
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className='p-6 space-y-4'>
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

        <button className='px-4 py-2 border rounded' onClick={refresh}>
          Refresh
        </button>
      </div>

      {/* ---------------- PORTFOLIO ---------------- */}
      <div className='border p-3 rounded'>
        <h2 className='font-bold'>Portfolio</h2>
        <pre>{JSON.stringify(portfolio, null, 2)}</pre>
      </div>

      {/* ---------------- TRANSACTIONS ---------------- */}
      <div className='border p-3 rounded'>
        <h2 className='font-bold'>Transactions</h2>
        <pre>{JSON.stringify(transactions, null, 2)}</pre>
      </div>

      {/* ---------------- AI ---------------- */}
      <div className='border p-3 rounded'>
        <h2 className='font-bold'>AI Decision</h2>
        <pre>{JSON.stringify(ai, null, 2)}</pre>
      </div>

      {/* ---------------- EXECUTION ---------------- */}
      <div className='border p-3 rounded'>
        <h2 className='font-bold'>Execution</h2>
        <pre>{JSON.stringify(execution, null, 2)}</pre>
      </div>
    </div>
  )
}
