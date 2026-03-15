import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production'

function getBearerToken(req) {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return null
  return header.slice(7)
}

export function signAuthToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }
}

export async function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req)

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required.' })
    }

    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.sub)

    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication expired.' })
    }

    req.user = user
    return next()
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid authentication token.' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have access to this resource.' })
    }

    return next()
  }
}