import { Router } from 'express'
import OnlineClass from '../models/OnlineClass.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { generateGoogleMeetLink } from '../services/meetService.js'

const router = Router()

/**
 * GET /api/online-classes
 * Get all online classes (public classes for users, all for admins)
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { status, forUserOnly } = req.query
    let query = {}

    // If user is not admin, only show public classes or assigned classes
    if (req.user.role !== 'admin') {
      query = {
        $or: [
          { isPublic: true },
          { assignedUsers: req.user._id },
        ],
      }
    }

    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status
    }

    const classes = await OnlineClass.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedUsers', 'name email')
      .sort({ date: 1, time: 1 })

    return res.json({ success: true, data: classes })
  } catch (error) {
    console.error('Online classes lookup error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * GET /api/online-classes/assigned
 * Get classes assigned to the current user (user endpoint)
 */
router.get('/assigned', requireAuth, requireRole('customer'), async (req, res) => {
  try {
    const classes = await OnlineClass.find({ assignedUsers: req.user._id })
      .populate('createdBy', 'name email')
      .sort({ date: 1, time: 1 })

    return res.json({ success: true, data: classes })
  } catch (error) {
    console.error('Assigned classes lookup error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * GET /api/online-classes/:id
 * Get a specific online class
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const onlineClass = await OnlineClass.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedUsers', 'name email')
      .populate('attendees.userId', 'name email')

    if (!onlineClass) {
      return res.status(404).json({ success: false, message: 'Online class not found' })
    }

    // Check if user has access to this class
    if (req.user.role !== 'admin' && !onlineClass.isPublic && !onlineClass.assignedUsers.some(u => u._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }

    return res.json({ success: true, data: onlineClass })
  } catch (error) {
    console.error('Online class lookup error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * POST /api/online-classes
 * Create a new online class (admin only)
 */
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { title, description, date, time, duration, maxParticipants, topic, isPublic, assignedUsers, resources } = req.body

    const errors = []
    if (!title?.trim()) errors.push('Title is required')
    if (!date?.trim()) errors.push('Date is required')
    if (!time?.trim()) errors.push('Time is required')
    if (!duration || duration < 15 || duration > 480) errors.push('Duration must be between 15 and 480 minutes')
    if (!topic?.trim()) errors.push('Topic is required')

    if (errors.length) {
      return res.status(400).json({ success: false, errors })
    }

    // Generate a Google Meet link
    const meetingLink = generateGoogleMeetLink()

    const onlineClass = await OnlineClass.create({
      title,
      description: description?.trim() || '',
      date,
      time,
      duration,
      meetingLink,
      maxParticipants: maxParticipants || 50,
      topic: topic?.trim() || '',
      isPublic: isPublic || false,
      assignedUsers: assignedUsers || [],
      createdBy: req.user._id,
      resources: resources || [],
      status: 'scheduled',
    })

    const populatedClass = await onlineClass.populate('createdBy', 'name email').populate('assignedUsers', 'name email')

    return res.status(201).json({
      success: true,
      message: 'Online class created successfully!',
      data: populatedClass,
    })
  } catch (error) {
    console.error('Online class creation error:', error)
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' })
  }
})

/**
 * PATCH /api/online-classes/:id
 * Update an online class (admin only)
 */
router.patch('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { title, description, date, time, duration, maxParticipants, topic, isPublic, status, assignedUsers, resources } = req.body
    const updateData = {}

    if (title !== undefined) updateData.title = title?.trim()
    if (description !== undefined) updateData.description = description?.trim()
    if (date !== undefined) updateData.date = date?.trim()
    if (time !== undefined) updateData.time = time?.trim()
    if (duration !== undefined) updateData.duration = duration
    if (maxParticipants !== undefined) updateData.maxParticipants = maxParticipants
    if (topic !== undefined) updateData.topic = topic?.trim()
    if (isPublic !== undefined) updateData.isPublic = isPublic
    if (status !== undefined && ['draft', 'scheduled', 'ongoing', 'completed', 'cancelled'].includes(status)) {
      updateData.status = status
    }
    if (assignedUsers !== undefined) updateData.assignedUsers = assignedUsers
    if (resources !== undefined) updateData.resources = resources

    const onlineClass = await OnlineClass.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name email')
      .populate('assignedUsers', 'name email')

    if (!onlineClass) {
      return res.status(404).json({ success: false, message: 'Online class not found' })
    }

    return res.json({
      success: true,
      message: 'Online class updated successfully!',
      data: onlineClass,
    })
  } catch (error) {
    console.error('Online class update error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * PATCH /api/online-classes/:id/assign-users
 * Assign users to an online class (admin only)
 */
router.patch('/:id/assign-users', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { userIds } = req.body

    if (!Array.isArray(userIds)) {
      return res.status(400).json({ success: false, message: 'userIds must be an array' })
    }

    const onlineClass = await OnlineClass.findByIdAndUpdate(
      req.params.id,
      { assignedUsers: userIds },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedUsers', 'name email')

    if (!onlineClass) {
      return res.status(404).json({ success: false, message: 'Online class not found' })
    }

    return res.json({
      success: true,
      message: 'Users assigned successfully!',
      data: onlineClass,
    })
  } catch (error) {
    console.error('Assign users error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * PATCH /api/online-classes/:id/join
 * Mark user as attended (user endpoint)
 */
router.patch('/:id/join', requireAuth, async (req, res) => {
  try {
    const onlineClass = await OnlineClass.findById(req.params.id)

    if (!onlineClass) {
      return res.status(404).json({ success: false, message: 'Online class not found' })
    }

    // Check if user is assigned to this class
    if (!onlineClass.assignedUsers.some(u => u.toString() === req.user._id.toString()) && !onlineClass.isPublic && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not assigned to this class' })
    }

    // Update attendee status
    const attendeeIndex = onlineClass.attendees.findIndex(a => a.userId.toString() === req.user._id.toString())

    if (attendeeIndex >= 0) {
      onlineClass.attendees[attendeeIndex].status = 'attended'
      onlineClass.attendees[attendeeIndex].joinedAt = new Date()
    } else {
      onlineClass.attendees.push({
        userId: req.user._id,
        status: 'attended',
        joinedAt: new Date(),
      })
    }

    await onlineClass.save()
    const updated = await onlineClass.populate('createdBy', 'name email').populate('assignedUsers', 'name email')

    return res.json({
      success: true,
      message: 'Attendance recorded!',
      data: updated,
      meetingLink: onlineClass.meetingLink,
    })
  } catch (error) {
    console.error('Join class error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

/**
 * DELETE /api/online-classes/:id
 * Delete an online class (admin only)
 */
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const onlineClass = await OnlineClass.findByIdAndDelete(req.params.id)

    if (!onlineClass) {
      return res.status(404).json({ success: false, message: 'Online class not found' })
    }

    return res.json({
      success: true,
      message: 'Online class deleted successfully!',
    })
  } catch (error) {
    console.error('Delete online class error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

export default router
