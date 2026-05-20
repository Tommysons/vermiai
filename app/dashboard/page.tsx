'use client'

import { useEffect, useState } from 'react'
import CoinCard from '../components/CoinCard'
import PortfolioSummary from '../components/PortfolioSummary'
import TransferPannel from '../components/TransferPannel'
import TransactionHistory from '../components/TransactionHistory'
import PortfolioChart from '../components/PortfolioChart'
import PortfolioHistoryChart from '../components/PortfolioHistoryChart'

import type { PortfolioInputs } from '../../types/portfolio'

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

type Snapshot = {
  _id: string
  totalValue: number
  createdAt: string
}

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<PortfolioInputs>(emptyPortfolio)
  const [prices, setPrices] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [ready, setReady] = useState(false)

  // -----------------------------
  // LOAD DATA
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

  async function loadPrice() {
    const res = await fetch('/api/prices')
    const data = await res.json()
    setPrices(data)
  }

  async function loadTransactions() {
    const res = await fetch('/api/transactions')
    const data = await res.json()
    setTransactions(data)
  }

  async function loadSnapshots() {
    const res = await fetch('/api/snapshots')
    const data = await res.json()
    setSnapshots(data)
  }

  // -----------------------------
  // INIT
  // -----------------------------
  useEffect(() => {
    async function init() {
      await Promise.all([
        loadPortfolio(),
        loadPrice(),
        loadTransactions(),
        loadSnapshots(),
      ])
      setReady(true)
    }
    init()
  }, [])

  // refresh prices only
  useEffect(() => {
    const interval = setInterval(() => {
      loadPrice()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // -----------------------------
  // UPDATE COIN
  // -----------------------------
  function updateCoin(coin: CoinKey, value: string) {
    setPortfolio((prev) => ({
      ...prev,
      [coin]: value === '' ? 0 : Number(value),
    }))
  }

  // -----------------------------
  // CHART DATA (SAFE)
  // -----------------------------
  const chartData = COINS.map((coin) => {
    const price = prices?.[coin] ?? 0
    const amount = portfolio[coin] ?? 0

    return {
      name: coin,
      value: amount * price,
    }
  }).filter((i) => i.value > 0)

  const totalValue = chartData.reduce((sum, i) => sum + i.value, 0)

  // -----------------------------
  // TRANSFER (WITH FEES FROM BACKEND)
  // -----------------------------
  async function transferFunds(
    from: CoinKey,
    to: CoinKey,
    amount: number,
    fee: number,
  ) {
    try {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to, amount, fee }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error)
        return
      }

      setPortfolio(data.portfolio)

      await loadTransactions()
      await loadSnapshots()
    } catch (err) {
      console.error(err)
    }
  }

  // -----------------------------
  // LOADING SCREEN
  // -----------------------------
  if (!ready) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black text-white'>
        Loading VermiAI...
      </div>
    )
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className='max-w-xl mx-auto p-6 text-white'>
      <h1 className='text-2xl font-bold mb-6'>VermiAI Dashboard</h1>

      <PortfolioSummary total={totalValue} />

      <PortfolioHistoryChart data={snapshots} />

      <PortfolioChart data={chartData} />

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

      <button
        onClick={() => loadPrice()}
        className='mt-4 w-full py-2 bg-blue-600 rounded-lg'
      >
        Refresh
      </button>

      <TransferPannel coins={COINS} onTransfer={transferFunds} />

      <TransactionHistory transactions={transactions} />
    </div>
  )
}
