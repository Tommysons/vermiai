'use client'

export default function Page() {
  async function savePortfolio() {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BTC: 0.007,
        ETH: 0,
        SOL: 2.1,
        TON: 0,
        BNB: 0,
        USDC: 195.63,
      }),
    })

    const data = await res.json()

    console.log(data)
    alert('Saved!')
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>VermiAI</h1>

      <button onClick={savePortfolio}>Save Portfolio</button>
    </div>
  )
}
