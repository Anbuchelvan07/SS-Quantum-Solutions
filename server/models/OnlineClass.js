import mongoose from 'mongoose'

const onlineClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Class title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    duration: {
      type: Number, // Duration in minutes
      required: [true, 'Duration is required'],
      min: 15,
      max: 480,
    },
    meetingLink: {
      type: String,
      required: [true, 'Meeting link is required'],
      trim: true,
    },
    maxParticipants: {
      type: Number,
      default: 50,
      min: 1,
    },
    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'draft',
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false, // If true, all users can see it; if false, only assigned users
    },
    attendees: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        joinedAt: {
          type: Date,
          default: null,
        },
        status: {
          type: String,
          enum: ['assigned', 'attended', 'no-show', 'cancelled'],
          default: 'assigned',
        },
      },
    ],
    topic: {
      type: String,
      trim: true,
    },
    resources: [
      {
        name: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
)

// Index for finding scheduled classes
onlineClassSchema.index(
  { date: 1, time: 1 },
  {
    name: 'scheduled_class_unique',
    partialFilterExpression: {
      status: { $in: ['draft', 'scheduled', 'ongoing'] },
    },
  }
)

// Index for finding classes by assigned users
onlineClassSchema.index({ assignedUsers: 1 })

// Index for finding public classes
onlineClassSchema.index({ isPublic: 1, status: 1 })

export default mongoose.model('OnlineClass', onlineClassSchema)
