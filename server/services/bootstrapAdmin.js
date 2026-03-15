import User from '../models/User.js'

export async function ensureAdminAccount() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@hrconsultancy.local').trim().toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin12345!'
  const adminName = (process.env.ADMIN_NAME || 'Site Admin').trim()

  const existingAdmin = await User.findOne({ email: adminEmail })
  if (existingAdmin) {
    if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin'
      await existingAdmin.save()
    }
    return existingAdmin
  }

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.warn('⚠️  Using default admin credentials. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before production.')
  }

  const passwordHash = await User.hashPassword(adminPassword)
  return User.create({
    name: adminName,
    email: adminEmail,
    passwordHash,
    role: 'admin',
  })
}