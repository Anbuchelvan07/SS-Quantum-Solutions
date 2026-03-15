import { Router } from 'express'
import User from '../models/User.js'
import { requireAuth, requireRole, serializeUser, signAuthToken } from '../middleware/auth.js'

const router = Router()

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8
}

async function loginForRole(req, res, role) {
  const { email, password } = req.body
  const normalizedEmail = email?.trim().toLowerCase()

  if (!normalizedEmail || !validatePassword(password)) {
    return res.status(400).json({ success: false, message: 'Valid email and password are required.' })
  }

  const user = await User.findOne({ email: normalizedEmail, role }).select('+passwordHash')

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' })
  }

  const token = signAuthToken(user)
  return res.json({ success: true, token, user: serializeUser(user) })
}

router.post('/customer/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()

    if (!name?.trim() || !normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail) || !validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Name, valid email, and a password with at least 8 characters are required.',
      })
    }

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account already exists for this email.' })
    }

    const passwordHash = await User.hashPassword(password)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'customer',
    })

    const token = signAuthToken(user)
    return res.status(201).json({ success: true, token, user: serializeUser(user) })
  } catch (error) {
    console.error('Customer registration error:', error)
    return res.status(500).json({ success: false, message: 'Unable to create account right now.' })
  }
})

router.post('/customer/login', async (req, res) => {
  try {
    return await loginForRole(req, res, 'customer')
  } catch (error) {
    console.error('Customer login error:', error)
    return res.status(500).json({ success: false, message: 'Unable to login right now.' })
  }
})

router.post('/admin/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()

    if (!name?.trim() || !normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail) || !validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Name, valid email, and a password with at least 8 characters are required.',
      })
    }

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account already exists for this email.' })
    }

    const passwordHash = await User.hashPassword(password)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'admin',
    })

    const token = signAuthToken(user)
    return res.status(201).json({ success: true, token, user: serializeUser(user) })
  } catch (error) {
    console.error('Admin registration error:', error)
    return res.status(500).json({ success: false, message: 'Unable to create account right now.' })
  }
})

router.post('/admin/login', async (req, res) => {
  try {
    return await loginForRole(req, res, 'admin')
  } catch (error) {
    console.error('Admin login error:', error)
    return res.status(500).json({ success: false, message: 'Unable to login right now.' })
  }
})

router.get('/me', requireAuth, (req, res) => {
  return res.json({ success: true, user: serializeUser(req.user) })
})

router.get('/admin/check', requireAuth, requireRole('admin'), (req, res) => {
  return res.json({ success: true, user: serializeUser(req.user) })
})

export default router