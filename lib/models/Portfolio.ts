import mongoose from 'mongoose'

const PortfolioSchema = new mongoose.Schema({
  BTC: { type: Number, default: 0 },
  ETH: { type: Number, default: 0 },
  SOL: { type: Number, default: 0 },
  TON: { type: Number, default: 0 },
  BNB: { type: Number, default: 0 },
  USDC: { type: Number, default: 0 },
})

export default mongoose.models.Portfolio ||
  mongoose.model('Portfolio', PortfolioSchema)
