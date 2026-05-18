import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Transaction from '@/lib/models/Transaction'

export async function GET() {
  try {
    await connectDB()

    const transactions = await Transaction.find({})
      .sort({ createdAt: -1 })
      .limit(20)
    return NextResponse.json(transactions)
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 },
    )
  }
}
