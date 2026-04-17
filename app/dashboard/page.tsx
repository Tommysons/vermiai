'use client'

import { useEffect, useState } from 'react'

type VermiData = {
  income: number
  investment: number
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
        setData(parsed)
      } catch {
        setData(null)
      }
    }
  }, [])

  // IMPORTANT: identical SSR + first client render
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

  const monthlyIncome = data.income * 30
  const roi = monthlyIncome / data.investment
  const score = Math.min(100, roi * 50)

  let message = ''
  if (score > 70) message = '🟢 Strong strategy'
  else if (score > 40) message = '🟡 Moderate'
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
        <p>📈 Monthly: ${monthlyIncome}</p>
        <p>🧠 Score: {score.toFixed(0)} / 100</p>
        <p>{message}</p>
      </div>
    </main>
  )
}
