'use client'

import { useState } from 'react'

export default function AddData() {
  const [income, setIncome] = useState('')
  const [investment, setInvestment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      income,
      investment,
    }

    console.log('Saved data:', data)

    // temporary storage (localStorage)
    localStorage.setItem('vermiai-data', JSON.stringify(data))

    alert('Data saved!')
  }

  return (
    <main className='min-h-screen bg-black text-white p-8'>
      <h1 className='text-3xl font-bold mb-6'>Add Data</h1>

      <form onSubmit={handleSubmit} className='space-y-4 max-w-md'>
        <input
          type='number'
          placeholder='Daily Income (USD)'
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className='w-full p-3 rounded bg-zinc-900'
        />

        <input
          type='number'
          placeholder='Total Investment (USD)'
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          className='w-full p-3 rounded bg-zinc-900'
        />

        <button
          type='submit'
          className='bg-white text-black px-6 py-3 rounded-xl font-semibold'
        >
          Save Data
        </button>
      </form>
    </main>
  )
}
