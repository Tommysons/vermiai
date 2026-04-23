'use client'

import { useEffect, useMemo, useState } from 'react'
import EarningsForm from '@/components/EarningForm'
import { getEarnings } from '@/lib/data/earnings'
import { getMonthlyEarnings, projectYearly } from '@/lib/utils/calculation'
import { getAIAdvice } from '@/lib/simulation/aiAdvisor'
import { calculateROI } from '@/lib/simulation/roi'

export default function Dashboard() {
  const [total, setTotal] = useState(0)
  const [roi, setRoi] = useState({
    minerROI: 0,
    aprSimpleEarn: 0,
    tokenAPR: 0,
  })

  const [ready, setReady] = useState(false)

  const refreshData = () => {
    const earnings = getEarnings()
    const totalValue = getMonthlyEarnings(earnings)
    const roiData = calculateROI(earnings)
    setTotal(totalValue)
    setRoi(roiData)
    setReady(true)
  }

  useEffect(() => {
    refreshData()
  }, [])

  const yearly = projectYearly(total)

  const ai = useMemo(() => {
    if (!total) {
      return {
        action: 'hold',
        reason: 'Waiting for data',
        confidence: 0,
      }
    }

    return getAIAdvice({
      cash: total,
      aprSimpleEarn: roi.aprSimpleEarn,
      minerROI: roi.minerROI,
      tokenAPR: roi.tokenAPR,
    })
  }, [total, roi])

  //prevent wrong first render
  if (!ready) {
    return (
      <div className='p-6'>
        <h1 className='text-2xl font-bold'>Loading VermiAI...</h1>
      </div>
    )
  }

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>VermiAI Dashboard</h1>

      {/* Earnings Form */}
      <EarningsForm onAdd={refreshData} />

      {/*Stats*/}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='p-4 border rounded-xl'>
          <h2 className='text-sm text-gray-500'>Total Earnings</h2>
          <p className='text-xl font-semibold'>${total.toFixed(2)}</p>
        </div>

        <div className='p-4 border rounded-xl'>
          <h2 className='text-sm text-gray-500'>Monthly Estimate</h2>
          <p className='text-xl font-semibold'>${total.toFixed(2)}</p>
        </div>

        <div className='p-4 border rounded-xl'>
          <h2 className='text-sm text-gray-500'>Yearly Projection</h2>
          <p className='text-xl font-semibold'>${yearly.toFixed(2)}</p>
        </div>
      </div>

      {/* AI Advice */}
      <div className='p-4 border rounded-xl'>
        <h2 className='text-lg font-semibold mb-2'>AI Advice</h2>
        <p>
          <strong>Action:</strong>
          {ai.action}
        </p>
        <p>
          <strong>Reason:</strong>
          {ai.reason}
        </p>
        <p>
          <strong>Confidence:</strong>
          {(ai.confidence * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  )
}
