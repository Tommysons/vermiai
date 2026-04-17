'use client'

import { useState } from 'react'
import { VermiData } from '@/lib/simulation'
import { useRouter } from 'next/navigation'

export default function AddPage() {
  const router = useRouter()

  const [form, setForm] = useState<VermiData>({
    income: 0,
    investment: 0,
    reinvestAmount: 0,
    months: 12,
    withdrawal: 0,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value === '' ? 0 : Number(value),
    })
  }

  function handleSubmit() {
    // basic validation (prevents broken simulation)
    if (form.income <= 0 || form.investment <= 0) {
      alert('Please enter valid income and investment')
      return
    }

    localStorage.setItem('vermiai-data', JSON.stringify(form))
    router.push('/dashboard')
  }

  return (
    <main className='min-h-screen bg-black text-white p-8'>
      <h1 className='text-3xl font-bold mb-6'>Add Data</h1>

      <div className='flex flex-col gap-4 max-w-md'>
        <input
          name='income'
          type='number'
          placeholder='Daily Income (e.g. 0.1)'
          onChange={handleChange}
          className='p-2 bg-zinc-900 rounded'
        />

        <input
          name='investment'
          type='number'
          placeholder='Initial Investment (e.g. 1000)'
          onChange={handleChange}
          className='p-2 bg-zinc-900 rounded'
        />

        <input
          name='reinvestAmount'
          type='number'
          placeholder='Monthly Reinvestment ($)'
          onChange={handleChange}
          className='p-2 bg-zinc-900 rounded'
        />

        <input
          name='withdrawal'
          type='number'
          placeholder='Monthly Withdrawal (Expenses)'
          onChange={handleChange}
          className='p-2 bg-zinc-900 rounded'
        />

        <input
          name='months'
          type='number'
          placeholder='Simulation Months (default 12)'
          onChange={handleChange}
          className='p-2 bg-zinc-900 rounded'
        />

        <button
          onClick={handleSubmit}
          className='bg-white text-black p-2 rounded font-bold'
        >
          Save & Run Simulation
        </button>
      </div>
    </main>
  )
}
