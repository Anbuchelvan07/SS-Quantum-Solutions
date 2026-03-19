import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import contactRoutes from './routes/contact.js'
import Appointment from './models/Appointment.js'
import User from './models/User.js'
import marketRoutes from './routes/market.js'
import appointmentRoutes from './routes/appointments.js'
import onlineClassRoutes from './routes/onlineClasses.js'
import { ensureAdminAccount } from './services/bootstrapAdmin.js'

const app = express()
const PORT = process.env.PORT || 5001

// Configure CORS for production and development
const corsOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
]

// Add production frontend URL if available
if (process.env.FRONTEND_URL) {
  corsOrigins.push(process.env.FRONTEND_URL)
}

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API is running.' })
})

app.use('/api/auth', authRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/market', marketRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/online-classes', onlineClassRoutes)

// Connect to MongoDB then start server
connectDB()
  .tconst OnlineClass = (await import('./models/OnlineClass.js')).default
    await Promise.all([User.syncIndexes(), Appointment.syncIndexes(), OnlineClass
    await Promise.all([User.syncIndexes(), Appointment.syncIndexes()])
    await ensureAdminAccount()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`CORS enabled for: ${corsOrigins.join(', ')}`)
    })
  })
  .catch((error) => {
    console.error('Failed to start server:', error)
    process.exit(1)
  })

