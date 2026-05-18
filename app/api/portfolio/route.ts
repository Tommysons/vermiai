import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Portfolio from '@/lib/models/Portfolio'

export async function POST(req: Request) {
  try {
    await connectDB()

    console.log('CONNECTED TO DB')

    const body = await req.json()

    const updated = await Portfolio.findOneAndUpdate(
      {}, // np filter = awlays same document
      body, // new values
      {
        upsert: true, //create if doesnt exist
        new: true, // return updated doc
      },
    )

    return NextResponse.json(updated)
  } catch (err) {
    console.error('SAVE ERROR:', err)

    return NextResponse.json(
      { error: 'Failed to save portfolio' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    await connectDB()

    const portfolio = await Portfolio.findOne()

    console.log('FOUND:', portfolio)

    return NextResponse.json(portfolio)
  } catch (err) {
    console.error('GET ERROR:', err)

    return NextResponse.json(
      { error: 'Failed to load portfolio' },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  try {
    await connectDB()

    await Portfolio.deleteOne({}) // delete the sinble doc

    return NextResponse.json({
      succes: true,
    })
  } catch (err) {
    console.log('Delete Error:', err)
    return NextResponse.json(
      {
        error: 'Failed to delete portfolio',
      },
      {
        status: 500,
      },
    )
  }
}
