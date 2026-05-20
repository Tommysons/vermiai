import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Portfolio from '@/lib/models/Portfolio'
import Transaction from '@/lib/models/Transaction'
import { getPrices } from '@/lib/getPrices'
import { COINS, type Coin } from '@/lib/coins'
import PortfolioSnapshot from '@/lib/models/PortfolioSnapshot'

export async function POST(req: Request) {
  try {
    await connectDB()

    const body: {
      from: Coin
      to: Coin
      amount: number
      fee?: number
    } = await req.json()

    const { from, to, amount } = body
    const fee = body.fee ?? 0 // 👈 IMPORTANT DEFAULT

    const portfolio = await Portfolio.findOne()

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 },
      )
    }

    const balances = portfolio as unknown as Record<Coin, number>

    if (from === to) {
      return NextResponse.json(
        { error: 'Cannot transfer same coin' },
        { status: 400 },
      )
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const prices = await getPrices()

    const fromPrice = prices[from]
    const toPrice = prices[to]

    if (!fromPrice || !toPrice) {
      return NextResponse.json({ error: 'Price unavailable' }, { status: 500 })
    }

    // =========================
    // 🔥 FEE LOGIC (IMPORTANT)
    // =========================
    const feePercent = body.fee ?? 0

    const feeAmount = amount * (feePercent / 100)
    const amountAfterFee = amount - feeAmount

    const usdValue = amountAfterFee * fromPrice
    const convertedAmount = usdValue / toPrice

    // balance check still uses FULL amount (correct behavior)
    if (balances[from] < amount) {
      return NextResponse.json({ error: 'Not enough balance' }, { status: 400 })
    }

    // update balances
    balances[from] = Number((balances[from] - amount).toFixed(8))
    balances[to] = Number((balances[to] + convertedAmount).toFixed(8))

    await portfolio.save()

    // snapshot
    const totalValue =
      balances.BTC * prices.BTC +
      balances.ETH * prices.ETH +
      balances.SOL * prices.SOL +
      balances.TON * prices.TON +
      balances.BNB * prices.BNB +
      balances.USDC * prices.USDC

    await PortfolioSnapshot.create({ totalValue })

    // transaction log
    await Transaction.create({
      from,
      to,
      fromAmount: amount,
      toAmount: convertedAmount,
      fromPrice,
      toPrice,
      usdValue,
      fee: feeAmount,
      feePercent,
    })

    return NextResponse.json({
      success: true,
      portfolio,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Transfer failed' }, { status: 500 })
  }
}
