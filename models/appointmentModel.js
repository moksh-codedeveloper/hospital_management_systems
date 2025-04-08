// models/appointmentModel.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  reason: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});


export const Appointment = mongoose.model('Appointment', appointmentSchema);