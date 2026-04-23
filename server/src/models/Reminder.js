const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Snoozed'],
    default: 'Active'
  },
  source: {
    type: String,
    enum: ['Manual', 'Assistant', 'System'],
    default: 'Manual'
  }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
