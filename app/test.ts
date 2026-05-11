import mongoose from 'mongoose'

async function test() {
  await mongoose.connect(process.env.MONGODB_URI!)
  console.log('CONNECTED')
}

test()
