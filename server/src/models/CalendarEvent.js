const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Exam', 'Deadline', 'Holiday', 'Workshop', 'Event'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    default: 'Academic'
  }
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
