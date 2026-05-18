import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Portfolio from '@/lib/models/Portfolio'
import Transaction from '@/lib/models/Transaction'
import { getPrices } from '@/lib/getPrices'
import { COINS, type Coin } from '@/lib/coins'

export async function POST(req: Request) {
  try {
    await connectDB()

    // -----------------------------
    // REQUEST BODY
    // -----------------------------
    const body: {
      from: Coin
      to: Coin
      amount: number
    } = await req.json()

    const { from, to, amount } = body

    // -----------------------------
    // GET PORTFOLIO
    // -----------------------------
    const portfolio = await Portfolio.findOne()

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 },
      )
    }

    // typed balances helper
    const balances = portfolio as unknown as Record<Coin, number>

    // -----------------------------
    // VALIDATE COINS
    // -----------------------------
    if (!COINS[from] || !COINS[to]) {
      return NextResponse.json({ error: 'Coin not found' }, { status: 400 })
    }

    // -----------------------------
    // VALIDATE TRANSFER
    // -----------------------------
    if (from === to) {
      return NextResponse.json(
        { error: 'Cannot transfer to same coin' },
        { status: 400 },
      )
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // -----------------------------
    // GET LIVE PRICES
    // -----------------------------
    const prices = await getPrices()

    const fromPrice = prices[from]
    const toPrice = prices[to]

    if (!fromPrice || !toPrice) {
      return NextResponse.json({ error: 'Price unavailable' }, { status: 500 })
    }

    // -----------------------------
    // CALCULATIONS
    // -----------------------------
    const usdValue = amount * fromPrice

    const convertedAmount = Number((usdValue / toPrice).toFixed(8))

    // -----------------------------
    // CHECK BALANCE
    // -----------------------------
    if (balances[from] < amount) {
      return NextResponse.json({ error: 'Not enough balance' }, { status: 400 })
    }

    // -----------------------------
    // UPDATE BALANCES
    // -----------------------------
    balances[from] = Number((balances[from] - amount).toFixed(8))

    balances[to] = Number((balances[to] + convertedAmount).toFixed(8))

    await portfolio.save()

    // -----------------------------
    // SAVE TRANSACTION
    // -----------------------------
    await Transaction.create({
      from,
      to,
      fromAmount: amount,
      toAmount: convertedAmount,
      fromPrice,
      toPrice,
      usdValue,
    })

    // -----------------------------
    // RESPONSE
    // -----------------------------
    return NextResponse.json({
      success: true,
      portfolio,
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json({ error: 'Transfer failed' }, { status: 500 })
  }
}
