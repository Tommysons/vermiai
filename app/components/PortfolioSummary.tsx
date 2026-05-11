type Props = {
  total: number
}

export default function PortfolioSummary({ total }: Props) {
  return (
    <div
      className='mb-6 p-5 rounded-2xl bg-zinc-950 border
        border-gray-800'
    >
      <h2 className='text-gray-400 text-sm'>Total Portfolio Value</h2>

      <div className='text-3xl font-bold text-white mt-2'>
        ${total.toFixed(2)}
      </div>
    </div>
  )
}
