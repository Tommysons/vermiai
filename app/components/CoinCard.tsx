type Props = {
  coin: string
  value: number
  price?: number
  allocation?: number
  usdValue?: number
  onChange: (value: string) => void
}

export default function CoinCard({
  coin,
  value,
  price,
  allocation,
  usdValue,
  onChange,
}: Props) {
  return (
    <div
      className='mb-3 p-4 rounded-2xl bg-zinc-900
      border border-zinc-800'
    >
      <div className='flex justify-between items-center mb-2'>
        <div>
          <h3 className='font-semibold text-white'>{coin}</h3>

          <p className='text-sm text-gray-400'>
            ${price?.toFixed(2) || '0.00'}
          </p>
          <p className='text-sm text-gray-400'>
            Value: ${usdValue?.toFixed(2)}
          </p>
          <p className='text-sm text-blue-400'>
            % {allocation?.toFixed(2)} of portfolio
          </p>
        </div>

        <input
          type='number'
          step='0.00001'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='bg-zinc-800 border border-zinc-700
          rounded-lg px-3 py-2 text-right text-white
          w-40'
        />
      </div>
    </div>
  )
}
