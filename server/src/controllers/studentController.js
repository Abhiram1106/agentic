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
  let profile = await StudentProfile.findOne({ user: req.user?._id });
  
  // Use mock profile if DB is wiped or missing
  if (!profile) {
    profile = { department: 'Computer Science', year: 4, semester: 7, section: 'A' };
  }
  
  const exams = await Exam.find({ 
    department: profile.department, 
    year: profile.year,
    semester: profile.semester
  });

  if (exams && exams.length > 0) {
    return res.json(exams);
  }

  // Fallback to dummy exams for development
  const dummyExams = [
    { _id: '1', title: 'Mid Semester Exam', subject: 'Cloud Computing', date: new Date(new Date().setDate(new Date().getDate() + 5)), time: '10:00 AM - 12:00 PM', location: 'Exam Hall A', department: profile.department, year: profile.year, semester: profile.semester },
    { _id: '2', title: 'Mid Semester Exam', subject: 'Machine Learning', date: new Date(new Date().setDate(new Date().getDate() + 7)), time: '02:00 PM - 04:00 PM', location: 'Exam Hall B', department: profile.department, year: profile.year, semester: profile.semester },
    { _id: '3', title: 'Mid Semester Exam', subject: 'Information Security', date: new Date(new Date().setDate(new Date().getDate() + 9)), time: '10:00 AM - 12:00 PM', location: 'Room 305', department: profile.department, year: profile.year, semester: profile.semester }
  ];

  res.json(dummyExams);
});

const getElectives = asyncHandler(async (req, res) => {
  let profile = await StudentProfile.findOne({ user: req.user?._id });
  
  if (!profile) {
    profile = { department: 'Computer Science', year: 4, semester: 7, section: 'A' };
  }

  const electives = await Elective.find({
    $or: [
      { departmentEligibility: profile.department },
      { departmentEligibility: 'Any' }
    ]
  });

  if (electives && electives.length > 0) {
    return res.json(electives);
  }

  // Fallback to dummy data for development
  const dummyElectives = [
    { 
      _id: '1', 
      name: 'Advanced Machine Learning', 
      faculty: 'Dr. Emily Stones', 
      credits: 3, 
      totalSeats: 60, 
      seatsAvailable: 45, 
      description: 'Deep dive into neural networks, deep learning architectures, and their practical applications.', 
      difficulty: 'Hard', 
      type: 'Professional', 
      departmentEligibility: ['Computer Science', 'Information Technology'],
      deadline: new Date(new Date().setDate(new Date().getDate() + 10))
    },
    { 
      _id: '2', 
      name: 'Cloud Computing Architecture', 
      faculty: 'Prof. Alan Turing', 
      credits: 4, 
      totalSeats: 100, 
      seatsAvailable: 12, 
      description: 'Design and implementation of scalable cloud applications using AWS and Azure.', 
      difficulty: 'Medium', 
      type: 'Professional', 
      departmentEligibility: ['Computer Science', 'Information Technology', 'Electronics'],
      deadline: new Date(new Date().setDate(new Date().getDate() + 5))
    },
    { 
      _id: '3', 
      name: 'Cyber Security Essentials', 
      faculty: 'Dr. Rivest', 
      credits: 3, 
      totalSeats: 50, 
      seatsAvailable: 50, 
      description: 'Fundamental concepts of cryptography, network security, and ethical hacking.', 
      difficulty: 'Medium', 
      type: 'Open Elective', 
      departmentEligibility: ['Any'],
      deadline: new Date(new Date().setDate(new Date().getDate() + 15))
    }
  ];

  res.json(dummyElectives);
});

const getPolicies = asyncHandler(async (req, res) => {
  const policies = await Policy.find({});
  res.json(policies);
});

const getCalendar = asyncHandler(async (req, res) => {
  const events = await CalendarEvent.find({});
  
  if (events && events.length > 0) {
    return res.json(events);
  }

  const dummyEvents = [
    // ---------- SEMESTER 1 ----------
    { date: "2025-09-22", title: "Commencement of Pre-Semester", type: "Academic" },
    { date: "2025-09-30", title: "Holiday - Durgashtami", type: "Holiday" },
    { date: "2025-10-02", title: "Gandhi Jayanti", type: "Holiday" },
    { date: "2025-10-20", title: "Diwali Holiday", type: "Holiday" },
    { date: "2025-10-29", title: "Commencement of Module-1", type: "Academic" },
    { date: "2025-11-24", title: "M2 Pre-Target 1", type: "Deadline" },
    { date: "2025-11-25", title: "M2 Pre-Target 1", type: "Deadline" },
    { date: "2025-12-04", title: "M1 Target 1", type: "Deadline" },
    { date: "2025-12-05", title: "M1 Target 1", type: "Deadline" },
    { date: "2025-12-06", title: "M1 Target 1", type: "Deadline" },
    { date: "2025-12-08", title: "Commencement of Module-2", type: "Academic" },
    { date: "2025-12-25", title: "Christmas Holiday", type: "Holiday" },
    { date: "2025-12-26", title: "M2 Pre-Target", type: "Deadline" },
    { date: "2025-12-27", title: "M2 Pre-Target", type: "Deadline" },
    { date: "2026-01-03", title: "M2 Pre-Target", type: "Deadline" },
    { date: "2026-01-05", title: "M2 Pre-Target", type: "Deadline" },
    { date: "2026-01-14", title: "Bhogi Holiday", type: "Holiday" },
    { date: "2026-01-15", title: "Pongal Holiday", type: "Holiday" },
    { date: "2026-01-16", title: "Kanuma Holiday", type: "Holiday" },
    { date: "2026-01-26", title: "Republic Day", type: "Holiday" },
    { date: "2026-02-14", title: "Last Date for Summative Assessment", type: "Deadline" },
    { date: "2026-02-17", title: "Preparation Begins", type: "Exam" },
    { date: "2026-02-18", title: "Preparation", type: "Exam" },
    { date: "2026-02-19", title: "Preparation", type: "Exam" },
    { date: "2026-02-20", title: "Summative Assessment Begins", type: "Exam" },
    { date: "2026-02-28", title: "Summative Assessment Ends", type: "Exam" },

    // ---------- SEMESTER 2 ----------
    { date: "2026-03-04", title: "Commencement of Semester 2", type: "Academic" },
    { date: "2026-03-19", title: "Ugadi Holiday", type: "Holiday" },
    { date: "2026-03-20", title: "Ramzan Holiday", type: "Holiday" },
    { date: "2026-03-27", title: "Sri Rama Navami", type: "Holiday" },
    { date: "2026-04-03", title: "Good Friday", type: "Holiday" },
    { date: "2026-04-14", title: "Ambedkar Jayanti", type: "Holiday" },
    { date: "2026-04-10", title: "M1 Target 1", type: "Deadline" },
    { date: "2026-04-11", title: "M1 Target 1", type: "Deadline" },
    { date: "2026-05-01", title: "M2 Pre-Target", type: "Deadline" },
    { date: "2026-05-02", title: "M2 Pre-Target", type: "Deadline" },
    { date: "2026-05-14", title: "M2 Pre-Target", type: "Deadline" },
    { date: "2026-05-15", title: "M2 Pre-Target", type: "Deadline" },
    { date: "2026-05-27", title: "Bakrid Holiday", type: "Holiday" },
    { date: "2026-06-20", title: "Last Date for Summative Assessment", type: "Deadline" },
    { date: "2026-06-22", title: "Preparation Begins", type: "Exam" },
    { date: "2026-06-23", title: "Preparation", type: "Exam" },
    { date: "2026-06-24", title: "Preparation", type: "Exam" },
    { date: "2026-06-25", title: "Muharram Holiday", type: "Holiday" },
    { date: "2026-06-26", title: "Summative Assessment Begins", type: "Exam" },
    { date: "2026-07-04", title: "Summative Assessment Ends", type: "Exam" }
  ].map(event => ({
    ...event,
    startDate: new Date(event.date),
    endDate: new Date(event.date),
    category: event.type === 'Holiday' ? 'Holiday' : 'Academic',
    description: event.title
  }));

  res.json(dummyEvents);
});

const getReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ student: req.user?._id });
  res.json(reminders);
});

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ student: req.user?._id }).sort('-timestamp');
  res.json(notifications);
});

const getTimetable = asyncHandler(async (req, res) => {
  let profile = await StudentProfile.findOne({ user: req.user?._id });
  
  if (!profile) {
    profile = { department: 'Computer Science', year: 4, semester: 7, section: 'A' };
  }
  
  const timetable = await Timetable.findOne({
    department: profile.department,
    year: profile.year,
    semester: profile.semester,
    section: profile.section
  });
  
  if (timetable && timetable.schedule && timetable.schedule.length > 0) {
    return res.json(timetable);
  }

  // Fallback to dummy data for development
  const dummySchedule = (() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const subjects = ['Cloud Computing', 'Machine Learning', 'Compiler Design', 'Information Security', 'Software Engineering', 'Internet of Things', 'Data Science', 'Library'];
    const teachers = ['Dr. Alan Turing', 'Dr. Andrew Ng', 'Prof. Grace Hopper', 'Prof. Rivest', 'Dr. Linus Torvalds', 'Dr. Vinton Cerf', 'Dr. Yann LeCun', 'Staff'];
    const rooms = ['301', '302', '303', '304', 'Lab 1', 'Lab 2', 'Auditorium 1', 'Ground'];
    const times = [
      { start: '09:00 AM', end: '09:50 AM', type: 'class' },
      { start: '09:50 AM', end: '10:40 AM', type: 'class' },
      { start: '10:40 AM', end: '11:00 AM', type: 'break' },
      { start: '11:00 AM', end: '11:50 AM', type: 'class' },
      { start: '11:50 AM', end: '12:40 PM', type: 'class' },
      { start: '12:40 PM', end: '01:30 PM', type: 'lunch' },
      { start: '01:30 PM', end: '02:20 PM', type: 'class' },
      { start: '02:20 PM', end: '03:10 PM', type: 'class' },
      { start: '03:20 PM', end: '04:10 PM', type: 'class' },
      { start: '04:10 PM', end: '05:00 PM', type: 'class' }
    ];

    return days.map(day => ({
      dayOfWeek: day,
      periods: times.map((time, idx) => {
        if (time.type === 'break') {
          return { subject: 'Short Break', startTime: time.start, endTime: time.end, room: 'Cafeteria', teacher: '-' };
        }
        if (time.type === 'lunch') {
          return { subject: 'Lunch Break', startTime: time.start, endTime: time.end, room: 'Cafeteria / Ground', teacher: '-' };
        }

        const subIdx = (days.indexOf(day) + idx) % subjects.length;
        if (day === 'Saturday' && idx >= 6) {
          return { subject: 'Sports / Clubs', startTime: time.start, endTime: time.end, room: 'Ground', teacher: 'Staff' };
        }
        return {
          subject: subjects[subIdx],
          startTime: time.start,
          endTime: time.end,
          room: rooms[subIdx % rooms.length],
          teacher: teachers[subIdx % teachers.length]
        };
      })
    }));
  })();

  res.json({
    department: profile.department,
    year: profile.year,
    semester: profile.semester,
    section: profile.section,
    schedule: dummySchedule
  });
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
