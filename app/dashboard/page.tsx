'use client'

import { useEffect, useState } from 'react'

type PortfolioInputs = {
  BTC: string
  ETH: string
  SOL: string
  TON: string
  BNB: string
  USDC: string
}

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

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 500,
        margin: '0 auto',
        fontFamily: 'sans-serif',
      }}
    >
      <h1>VermiAI Dashboard</h1>

      <h2>Total Value</h2>

      <div
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        ${total.toFixed(2)}
      </div>

      <button
        onClick={loadPrice}
        style={{
          marginBottom: 20,
          padding: '10px 20px',
          cursor: 'pointer',
        }}
      >
        Refresh Prices
      </button>

      <h2>Portfolio</h2>

      {Object.keys(portfolio).map((coin) => (
        <div
          key={coin}
          style={{
            marginBottom: 12,
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <label
            style={{
              width: 100,
              fontWeight: 'bold',
            }}
          >
            {coin}
          </label>

          <input
            type='number'
            step='0.00001'
            value={portfolio[coin as keyof PortfolioInputs]}
            onChange={(e) =>
              updateCoin(coin as keyof PortfolioInputs, e.target.value)
            }
            placeholder='0'
            style={{
              flex: 1,
              padding: 8,
            }}
          />
        </div>
      ))}

      <button
        onClick={savePortfolio}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Saving...' : 'Save Portfolio'}
      </button>

      <h2 style={{ marginTop: 40 }}>Live Prices</h2>

      <pre>{JSON.stringify(prices, null, 2)}</pre>
    </div>
  )
}
