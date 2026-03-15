import { Router } from 'express'
import Appointment from '../models/Appointment.js'
import { sendAppointmentEmail } from '../services/mailService.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { generateGoogleMeetLink, isValidGoogleMeetLink } from '../services/meetService.js'

const router = Router()

router.get('/booked-slots', async (req, res) => {
  try {
    const { date } = req.query
    if (!date) return res.status(400).json({ success: false, message: 'date query param required' })

    const slots = await Appointment.find({ date, status: { $ne: 'cancelled' } }).select('time -_id')
    return res.json({ success: true, bookedTimes: slots.map((slot) => slot.time) })
  } catch (error) {
    console.error('Booked slots lookup error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/appointments
 * Book a new consultation slot
 */
router.post('/', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const { name, date, time, notes, consultationType } = req.body
    const customerName = name?.trim() || req.user.name
    const customerEmail = req.user.email

    console.log('[BOOKING CREATE] Received:', { name: customerName, date, time, consultationType, notes: notes?.substring(0, 50) })

    const errors = []
    if (!customerName) errors.push('Name is required')
    if (!customerEmail || !/^\S+@\S+\.\S+$/.test(customerEmail)) errors.push('Valid email is required')
    if (!date) errors.push('Date is required')
    if (!time) errors.push('Time is required')
    if (!consultationType || !['online', 'offline'].includes(consultationType)) {
      errors.push('Valid consultation type is required (online or offline)')
    }

    if (errors.length) {
      console.log('[BOOKING CREATE] Validation failed:', errors)
      return res.status(400).json({ success: false, errors })
    }

    const existing = await Appointment.findOne({ date, time, status: { $ne: 'cancelled' } })
    if (existing) {
      console.log('[BOOKING CREATE] Time slot already booked')
      return res.status(409).json({
        success: false,
        message: `The slot on ${date} at ${time} is already booked. Please choose a different date or time.`,
      })
    }

    const appointment = await Appointment.create({
      customer: req.user._id,
      name: customerName,
      email: customerEmail,
      date,
      time,
      notes: notes?.trim() || '',
      consultationType,
    })

    console.log('[BOOKING CREATE] Success - ID:', appointment._id, 'Type:', appointment.consultationType)

    sendAppointmentEmail({ name: customerName, email: customerEmail, date, time, notes }).catch((mailErr) => {
      console.error('Email send failed (appointment still saved):', mailErr.message)
    })

    return res.status(201).json({
      success: true,
      message: 'Consultation booked successfully!',
      data: appointment,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This slot was just booked by someone else. Please pick another time.',
      })
    }
    console.error('Appointment creation error:', error)
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' })
  }
})

router.get('/mine', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ customer: req.user._id }).sort({ date: 1, time: 1, createdAt: -1 })
    return res.json({ success: true, data: appointments })
  } catch (error) {
    console.error('Customer appointments lookup error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.query
    const query = status && status !== 'all' ? { status } : {}
    const appointments = await Appointment.find(query)
      .populate('customer', 'name email role')
      .sort({ createdAt: -1 })

    return res.json({ success: true, data: appointments })
  } catch (error) {
    console.error('Admin appointments lookup error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.patch('/:id/status', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body
    const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled']

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status.' })
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Booking not found.' })
    }

    return res.json({ success: true, data: appointment })
  } catch (error) {
    console.error('Booking status update error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * PATCH /api/appointments/:id/meeting
 * Set up online consultation meeting for an appointment
 */
router.patch('/:id/meeting', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { consultationType, meetingLink } = req.body
    const appointmentId = req.params.id
    
    console.log(`[MEETING SETUP] ID: ${appointmentId}, Type: ${consultationType}, Link: ${meetingLink}`)

    if (!['online', 'offline'].includes(consultationType)) {
      return res.status(400).json({ success: false, message: 'Invalid consultation type.' })
    }

    let updateData = { consultationType }

    if (consultationType === 'online') {
      // Generate a new meeting link if not provided
      const link = meetingLink || generateGoogleMeetLink()

      if (!isValidGoogleMeetLink(link)) {
        return res.status(400).json({ success: false, message: 'Invalid Google Meet link format.' })
      }

      updateData.meetingLink = link
    } else {
      // Remove meeting link for offline consultations
      updateData.meetingLink = null
    }

    console.log(`[MEETING SETUP] Updating appointment ${appointmentId} with:`, updateData)
    
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true, runValidators: true }
    )

    if (!appointment) {
      console.error(`[MEETING SETUP] Appointment not found for ID: ${appointmentId}`)
      return res.status(404).json({ success: false, message: 'Booking not found.' })
    }

    console.log(`[MEETING SETUP] Success for ID: ${appointmentId}`)
    return res.json({
      success: true,
      message: `Consultation updated to ${consultationType}${consultationType === 'online' ? ` with meeting link: ${appointment.meetingLink}` : ''}`,
      data: appointment,
    })
  } catch (error) {
    console.error('Meeting setup error:', error)
    return res.status(500).json({ success: false, message: `Server error: ${error.message}` })
  }
})

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Booking not found.' })
    }

    return res.json({ success: true, message: 'Booking deleted successfully.' })
  } catch (error) {
    console.error('Booking deletion error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

export default router
