'use client'

import { useState } from 'react'
import { addEarning } from '@/lib/data/earnings'
import { EarningSource } from '@/lib/data/types'

export default function EarningsForm() {
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState<EarningSource>('gomining')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const parsedAmount = parseFloat(amount)

    // ✅ validation happens ONLY on submit
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setError('')

    addEarning({
      id: crypto.randomUUID(),
      date,
      amountUSD: parsedAmount,
      source,
    })

    // reset form
    setAmount('')
  }

  return (
    <form onSubmit={handleSubmit} className='p-4 border rounded-xl space-y-4'>
      <h2 className='text-lg font-semibold'>Add Daily Earnings</h2>

      {/* Amount */}
      <div>
        <label className='block text-sm'>Amount ($)</label>
        <input
          type='number'
          step='0.01'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className='w-full border p-2 rounded'
          placeholder='e.g. 12.50'
        />
      </div>

      {/* Source */}
      <div>
        <label className='block text-sm'>Source</label>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as EarningSource)}
          className='w-full border p-2 rounded'
        >
          <option value='gomining'>GoMining</option>
          <option value='staking'>Staking</option>
          <option value='miner'>Miner</option>
          <option value='other'>Other</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label className='block text-sm'>Date</label>
        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='w-full border p-2 rounded'
        />
      </div>

      {/* Error message */}
      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <button
        type='submit'
        className='w-full bg-black text-white p-2 rounded hover:opacity-90'
      >
        Add Entry
      </button>
    </form>
  )
}
