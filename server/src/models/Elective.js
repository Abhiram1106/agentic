const mongoose = require('mongoose');

const electiveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  faculty: {
    type: String,
    required: true,
    trim: true
  },
  credits: {
    type: Number,
    required: true
  },
  seatsAvailable: {
    type: Number,
    required: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  departmentEligibility: [String],
  yearEligibility: [Number],
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['Professional', 'Open', 'Science', 'Humanities'],
    default: 'Professional'
  }
}, { timestamps: true });

module.exports = mongoose.model('Elective', electiveSchema);
