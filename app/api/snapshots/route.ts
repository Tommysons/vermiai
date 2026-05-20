import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import PortfolioSnapshot from '@/lib/models/PortfolioSnapshot'

export async function GET() {
  try {
    await connectDB()

    const snapshots = await PortfolioSnapshot.find().sort({ createdAt: 1 })

    return NextResponse.json(snapshots)
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: 'Failed to fetch snapshots' },
      { status: 500 },
    )
  }
}
