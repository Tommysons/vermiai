import mongoose from 'mongoose'

const PortfolioSchema = new mongoose.Schema({
  BTC: Number,
  ETH: Number,
  SOL: Number,
  TON: Number,
  BNB: Number,
  USDC: Number,
})

export default mongoose.models.Portfolio ||
  mongoose.model('Portfolio', PortfolioSchema)
