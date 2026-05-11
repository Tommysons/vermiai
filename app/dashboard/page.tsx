'use client'

import { useEffect, useState } from 'react'
import CoinCard from '../components/CoinCard'
import PortfolioSummary from '../components/PortfolioSummary'
import TransferPannel from '../components/TransferPannel'
import type { Coin, PortfolioInputs } from '../../types/portfolio'

type CoinKey = keyof PortfolioInputs

// type PortfolioInputs = {
//   BTC: string
//   ETH: string
//   SOL: string
//   TON: string
//   BNB: string
//   USDC: string
// }

// type Coin = keyof PortfolioInputs

const emptyPortfolio: PortfolioInputs = {
  BTC: '',
  ETH: '',
  SOL: '',
  TON: '',
  BNB: '',
  USDC: '',
}

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<PortfolioInputs>(emptyPortfolio)

  const [prices, setPrices] = useState<any>(null)
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  // -----------------------------
  // LOAD PORTFOLIO
  // -----------------------------
  async function loadPortfolio() {
    try {
      const res = await fetch('/api/portfolio')
      const data = await res.json()

      console.log('LOADED', data)

      if (!data) return

      setPortfolio({
        BTC: String(data.BTC ?? ''),
        ETH: String(data.ETH ?? ''),
        SOL: String(data.SOL ?? ''),
        TON: String(data.TON ?? ''),
        BNB: String(data.BNB ?? ''),
        USDC: String(data.USDC ?? ''),
      })
    } catch (err) {
      console.error(err)
    }
  }

  // -----------------------------
  // LOAD PRICES
  // -----------------------------
  async function loadPrice() {
    try {
      const res = await fetch('/api/prices')
      const data = await res.json()

      setPrices(data)
    } catch (err) {
      console.error(err)
    }
  }

  // -----------------------------
  // SAVE PORTFOLIO
  // -----------------------------
  async function savePortfolio() {
    try {
      setLoading(true)

      await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BTC: Number(portfolio.BTC || 0),
          ETH: Number(portfolio.ETH || 0),
          SOL: Number(portfolio.SOL || 0),
          TON: Number(portfolio.TON || 0),
          BNB: Number(portfolio.BNB || 0),
          USDC: Number(portfolio.USDC || 0),
        }),
      })

      alert('Portfolio saved.')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // -----------------------------
  // UPDATE INPUT
  // -----------------------------
  function updateCoin(coin: keyof PortfolioInputs, value: string) {
    setPortfolio((prev) => ({
      ...prev,
      [coin]: value,
    }))
  }

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    loadPortfolio()
    loadPrice()
  }, [])

  // -----------------------------
  // RECALCULATE TOTAL
  // -----------------------------
  useEffect(() => {
    if (!prices) return

    const value =
      Number(portfolio.BTC || 0) * (prices.BTC || 0) +
      Number(portfolio.ETH || 0) * (prices.ETH || 0) +
      Number(portfolio.SOL || 0) * (prices.SOL || 0) +
      Number(portfolio.TON || 0) * (prices.TON || 0) +
      Number(portfolio.BNB || 0) * (prices.BNB || 0) +
      Number(portfolio.USDC || 0) * (prices.USDC || 0)

    setTotal(value)
  }, [portfolio, prices])

  function transferFounds(from: Coin, to: Coin, amount: number) {
    if (!prices) return

    const fromPrice = prices[from]
    const toPrice = prices[to]

    const usdValue = amount * fromPrice
    const converted = usdValue / toPrice

    setPortfolio((prev) => ({
      ...prev,
      [from]: String(Number(prev[from]) - amount),
      [to]: String(Number(prev[to]) + converted),
    }))
  }

  return (
    <div className='max-w-xl mx-auto p-6 text-white'>
      <h1 className='text-2xl font-bold mb-6'>VermiAI Dashboard</h1>

      {/*Summary*/}
      <PortfolioSummary total={total} />

      {/*Refresh prices*/}
      <button
        onClick={loadPrice}
        className='mb-6 px-4 py-2 bg-zinc-800 rounded-lg 
            hover:bg-zinc-700'
      >
        Refresh Prices
      </button>

      {/*Coins*/}
      <h2 className='text-lg font-semibold mb-3'>Portfolio</h2>
      {Object.keys(portfolio).map((coin) => (
        <CoinCard
          key={coin}
          coin={coin}
          value={portfolio[coin as CoinKey] ?? ''}
          price={prices?.[coin]}
          onChange={(value) => updateCoin(coin as keyof PortfolioInputs, value)}
        />
      ))}

      {/*Save button*/}
      <button
        onClick={savePortfolio}
        disabled={loading}
        className='mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500
            rounded-lg'
      >
        {loading ? 'Saving...' : 'Save Portfolio'}
      </button>

      {/*Transfer pannel*/}
      <TransferPannel
        coins={Object.keys(portfolio) as CoinKey[]}
        onTransfer={transferFounds}
      />

      {/*Raw data debug*/}
      <pre className='mt-6 text-xs text-gray-400'>
        {JSON.stringify(prices, null, 2)}
      </pre>
    </div>
  )
}
