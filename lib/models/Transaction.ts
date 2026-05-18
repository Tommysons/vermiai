import mongoose, { model, models } from 'mongoose'

const TransactionSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    fromAmount: {
      type: Number,
      required: true,
    },
    toAmount: {
      type: Number,
      required: true,
    },
    fromPrice: {
      type: Number,
      required: true,
    },
    toPrice: {
      type: Number,
      required: true,
    },
    usdValue: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const Transaction =
  models.Transaction || model('Transaction', TransactionSchema)

export default Transaction
