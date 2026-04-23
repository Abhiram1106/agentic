const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true },   // e.g., "10:00"
  room: { type: String, required: true },
  teacher: { type: String, required: true }
});

const dayScheduleSchema = new mongoose.Schema({
  dayOfWeek: { type: String, required: true }, // "Monday", "Tuesday", etc.
  periods: [periodSchema]
});

const timetableSchema = new mongoose.Schema({
  department: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  section: { type: String, required: true, trim: true },
  schedule: [dayScheduleSchema]
}, { timestamps: true });

// Ensure uniqueness per class section
timetableSchema.index({ department: 1, year: 1, semester: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);
