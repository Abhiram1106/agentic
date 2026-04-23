const Exam = require('../models/Exam');
const Elective = require('../models/Elective');
const Policy = require('../models/Policy');
const CalendarEvent = require('../models/CalendarEvent');
const Timetable = require('../models/Timetable');
const asyncHandler = require('express-async-handler');

const createExam = asyncHandler(async (req, res) => {
  const exam = await Exam.create(req.body);
  res.status(201).json(exam);
});

const createElective = asyncHandler(async (req, res) => {
  const elective = await Elective.create(req.body);
  res.status(201).json(elective);
});

const createPolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.create(req.body);
  res.status(201).json(policy);
});

const createEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.create(req.body);
  res.status(201).json(event);
});

const createTimetable = asyncHandler(async (req, res) => {
  const { department, year, semester, section } = req.body;
  
  // Use findOneAndUpdate with upsert to either create a new one or update the existing one
  const timetable = await Timetable.findOneAndUpdate(
    { department, year, semester, section },
    req.body,
    { new: true, upsert: true }
  );
  
  res.status(201).json(timetable);
});

module.exports = {
  createExam,
  createElective,
  createPolicy,
  createEvent,
  createTimetable
};
