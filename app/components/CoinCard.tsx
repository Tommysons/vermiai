type Props = {
  coin: string
  value: string
  price?: number
  onChange: (value: string) => void
}

export default function CoinCard({ coin, value, price, onChange }: Props) {
  return (
    <div className='border border-gray-800 rounded-xl p-4 mb-3 bg-zinc-950'>
      <div className='flex justify-between items-center mb-3'>
        <span className='font-semibold text-white'>{coin}</span>
        <span className='text-gray-400 text-sm'>
          ${price?.toFixed(2) ?? '0.00'}
        </span>
      </div>
      <input
        type='number'
        step='0.00001'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='0'
        className='w-full p-2 rounded-lg bg-zinc-900 border 
                border-gray-700  text-white outline-none focus:border-blue-500'
      />
    </div>
  )
}
