import mongoose from 'mongoose'

const PortfolioSnapshotSchema = new mongoose.Schema(
  {
    totalValue: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.PortfolioSnapshot ||
  mongoose.model('PortfolioSnapshot', PortfolioSnapshotSchema)
