import { Router } from 'express'
import { sendContactFormEmail } from '../services/mailService.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, organization, topic, message } = req.body

    // Validation
    const errors = []
    if (!name?.trim()) errors.push('Name is required')
    if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required')
    if (!organization?.trim()) errors.push('Organization is required')
    if (!topic?.trim()) errors.push('Topic is required')
    if (!message?.trim()) errors.push('Message is required')

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors })
    }

    // Send email to admin
    await sendContactFormEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      organization: organization.trim(),
      topic: topic.trim(),
      message: message.trim(),
    })

    return res.status(201).json({
      success: true,
      message: 'Your enquiry has been received. We will respond within two business days.',
    })
  } catch (error) {
    console.error('Contact form submission error:', error)
    return res.status(500).json({
      success: false,
      message: 'Unable to submit your enquiry right now. Please try again later.',
    })
  }
})

export default router
