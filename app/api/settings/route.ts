import { NextResponse } from 'next/server'
import { settings } from '@/lib/settings'

export async function GET() {
  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  const body = await req.json()

  if (typeof body.tradingFeePercent === 'number') {
    settings.tradingFeePercent = body.tradingFeePercent
  }

  return NextResponse.json(settings)
}
