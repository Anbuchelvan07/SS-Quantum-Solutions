import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    notes: {
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
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    consultationType: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
    meetingLink: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
)

appointmentSchema.index(
  { date: 1, time: 1 },
  {
    unique: true,
    name: 'active_slot_unique',
    partialFilterExpression: {
      status: { $in: ['pending', 'confirmed', 'completed'] },
    },
  }
)

export default mongoose.model('Appointment', appointmentSchema)
