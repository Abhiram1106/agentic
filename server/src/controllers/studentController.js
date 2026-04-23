const Exam = require('../models/Exam');
const Elective = require('../models/Elective');
const Policy = require('../models/Policy');
const CalendarEvent = require('../models/CalendarEvent');
const Reminder = require('../models/Reminder');
const Notification = require('../models/Notification');
const StudentProfile = require('../models/StudentProfile');
const Timetable = require('../models/Timetable');
const asyncHandler = require('express-async-handler');

const getExams = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  
  const exams = await Exam.find({ 
    department: profile.department, 
    year: profile.year,
    semester: profile.semester
  });
  res.json(exams);
});

const getElectives = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });
  const electives = await Elective.find({
    $or: [
      { departmentEligibility: profile.department },
      { departmentEligibility: 'Any' }
    ]
  });
  res.json(electives);
});

const getPolicies = asyncHandler(async (req, res) => {
  const policies = await Policy.find({});
  res.json(policies);
});

const getCalendar = asyncHandler(async (req, res) => {
  const events = await CalendarEvent.find({});
  res.json(events);
});

const getReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ student: req.user._id });
  res.json(reminders);
});

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ student: req.user._id }).sort('-timestamp');
  res.json(notifications);
});

const getTimetable = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  
  const timetable = await Timetable.findOne({
    department: profile.department,
    year: profile.year,
    semester: profile.semester,
    section: profile.section
  });
  
  res.json(timetable || { schedule: [] });
});

module.exports = {
  getExams,
  getElectives,
  getPolicies,
  getCalendar,
  getReminders,
  getNotifications,
  getTimetable
};
