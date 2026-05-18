type Transaction = {
  _id: string
  from: string
  to: string
  fromAmount: number
  toAmount: number
  usdValue: number
  createdAt: string
}

type Props = {
  transactions: Transaction[]
}

export default function TransactionHistory({ transactions }: Props) {
  return (
    <div className='mt-8 p-5 rounded-2xl bg-zinc-950 border border-zinc-800'>
      <h2 className='text-xl font-semibold text-white mb-4'>
        Transaction History
      </h2>

      {transactions.length === 0 ? (
        <p className='text-gray-400'>No transactions yet</p>
      ) : (
        <div className='space-y-3'>
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className='p-4 rounded-xl bg-zinc-900 border border-zinc-800'
            >
              <div className='flex justify-between items-center'>
                <div>
                  <p className='text-white font-medium'>
                    {Number(tx.fromAmount).toFixed(6)} {tx.from} →{' '}
                    {Number(tx.toAmount).toFixed(6)} {tx.to}
                  </p>

                  <p className='text-sm text-gray-400'>
                    ${Number(tx.usdValue).toFixed(2)}
                  </p>
                </div>

                <div className='text-xs text-gray-500'>
                  {new Date(tx.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
