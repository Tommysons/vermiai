import { useState } from 'react'

import { PortfolioInputs } from '../../types/portfolio'

type CoinKey = keyof PortfolioInputs

type Props = {
  coins: CoinKey[]
  onTransfer: (from: CoinKey, to: CoinKey, amount: number) => void
}

export default function TransferPannel({ coins, onTransfer }: Props) {
  const [from, setFrom] = useState<CoinKey>('BTC')
  const [to, setTo] = useState<CoinKey>('ETH')
  const [amount, setAmount] = useState('')

  return (
    <div
      className='mt-8 p-5 border border-gray-800 rounded-2xl
        bg-zinc-950'
    >
      <h2 className='text-white font-semibold mt-4'>Transfer Funds</h2>

      <div className='flex gap-2 mg-3'>
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value as CoinKey)}
          className='flex-1 p-2 bg-zinc-900 border
                    border-gray-700 rounded-lg text-white'
        >
          {coins.map((coin) => (
            <option key={coin}>{coin}</option>
          ))}
        </select>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value as CoinKey)}
          className='flex-1 p-2 bg-zinc-900 border
                    border-gray-700 rounded-lg text-white'
        >
          {coins.map((coin) => (
            <option key={coin}>{coin}</option>
          ))}
        </select>
      </div>

      <input
        type='number'
        placeholder='Amount'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className='w-full p-2 mb-3 bg-zinc-900 border
                border-gray-700 rounded-lg text-white'
      />

      <button
        onClick={() => {
          onTransfer(from, to, Number(amount))
          setAmount('')
        }}
        className='w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500
                transition text-white font-medium'
      >
        Transfer
      </button>
    </div>
  )
}
