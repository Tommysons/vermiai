'use client'

import { useEffect, useState } from 'react'
import CoinCard from '../components/CoinCard'
import PortfolioSummary from '../components/PortfolioSummary'
import TransferPannel from '../components/TransferPannel'
import TransactionHistory from '../components/TransactionHistory'
import PortfolioChart from '../components/PortfolioChart'

import type { PortfolioInputs } from '../../types/portfolio'
import { clear } from 'console'
import { set } from 'mongoose'
import { read } from 'fs'

type CoinKey = keyof PortfolioInputs
const COINS: CoinKey[] = ['BTC', 'ETH', 'SOL', 'TON', 'BNB', 'USDC']

const emptyPortfolio: PortfolioInputs = {
  BTC: 0,
  ETH: 0,
  SOL: 0,
  TON: 0,
  BNB: 0,
  USDC: 0,
}

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<PortfolioInputs>(emptyPortfolio)
  const [prices, setPrices] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [ready, setReady] = useState(false)

  // -----------------------------
  // LOAD PORTFOLIO
  // -----------------------------
  async function loadPortfolio() {
    const res = await fetch('/api/portfolio')
    const data = await res.json()

    setPortfolio({
      BTC: data.BTC ?? 0,
      ETH: data.ETH ?? 0,
      SOL: data.SOL ?? 0,
      TON: data.TON ?? 0,
      BNB: data.BNB ?? 0,
      USDC: data.USDC ?? 0,
    })
  }

  // -----------------------------
  // LOAD PRICES
  // -----------------------------
  async function loadPrice() {
    try {
      const res = await fetch('/api/prices')

      if (!res.ok) {
        throw new Error('Failed to fetch prices')
      }

      const data = await res.json()

      setPrices(data)
    } catch (err) {
      console.error(err)
    }
  }

  // -----------------------------
  // LOAD TRANSACTIONS
  // -----------------------------
  async function loadTransactions() {
    const res = await fetch('/api/transactions')
    const data = await res.json()
    setTransactions(data)
  }

  // -----------------------------
  // SAVE
  // -----------------------------
  async function savePortfolio() {
    setLoading(true)

    await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(portfolio),
    })

    setLoading(false)
  }

  // -----------------------------
  // UPDATE
  // -----------------------------
  function updateCoin(coin: CoinKey, value: string) {
    setPortfolio((prev) => ({
      ...prev,
      [coin]: value === '' ? 0 : Number(value),
    }))
  }

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    async function init() {
      await Promise.all([loadPortfolio(), loadPrice(), loadTransactions()])
      setReady(true)
    }
    init()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      loadPrice()
    }, 30000) // every 30 seconds

    return () => clearInterval(interval)
  }, [])
  // -----------------------------
  // CHART DATA (FIXED)
  // -----------------------------
  const chartData = COINS.map((coin) => {
    const value = (portfolio[coin] ?? 0) * (prices?.[coin] ?? 0)
    return {
      name: coin,
      value,
    }
  })

  const totalValue = chartData.reduce((sum, i) => sum + i.value, 0)

  async function transferFunds(from: CoinKey, to: CoinKey, amount: number) {
    try {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, amount }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error)
        return
      }

      setPortfolio({
        BTC: data.portfolio.BTC,
        ETH: data.portfolio.ETH,
        SOL: data.portfolio.SOL,
        TON: data.portfolio.TON,
        BNB: data.portfolio.BNB,
        USDC: data.portfolio.USDC,
      })

      await loadTransactions()
    } catch (err) {
      console.error(err)
    }
  }

  if (!ready) {
    return <div className='p-10 text-white'>Loading VermiAI...</div>
  }

  return (
    <div className='max-w-xl mx-auto p-6 text-white'>
      <h1 className='text-2xl font-bold mb-6'>VermiAI Dashboard</h1>

      {/* SUMMARY */}
      <PortfolioSummary total={totalValue} />

      {/* CHART */}
      <PortfolioChart data={chartData} />

      {/* COINS */}
      <h2 className='text-lg font-semibold mt-6 mb-3'>Portfolio</h2>

      {COINS.map((coin) => (
        <CoinCard
          key={coin}
          coin={coin}
          value={portfolio[coin] ?? 0}
          price={prices?.[coin]}
          usdValue={(portfolio[coin] ?? 0) * (prices?.[coin] ?? 0)}
          allocation={
            totalValue > 0
              ? (((portfolio[coin] ?? 0) * (prices?.[coin] ?? 0)) /
                  totalValue) *
                100
              : 0
          }
          onChange={(value) => updateCoin(coin, value)}
        />
      ))}

      {/* SAVE */}
      <button
        onClick={savePortfolio}
        disabled={loading}
        className='mt-4 w-full py-2 bg-blue-600 rounded-lg'
      >
        {loading ? 'Saving...' : 'Save'}
      </button>

      {/* TRANSFER */}
      <TransferPannel coins={COINS} onTransfer={transferFunds} />

      {/* HISTORY */}
      <TransactionHistory transactions={transactions} />
    </div>
  )
}
