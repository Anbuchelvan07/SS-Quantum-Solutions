import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hr_consultancy'

let cached = null

export default async function connectDB() {
  if (cached) return cached

  try {
    cached = await mongoose.connect(MONGO_URI)
    console.log('✅ MongoDB connected:', mongoose.connection.host)
    return cached
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  }
}
