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

  // Fallback to dummy events for development
  const today = new Date();
  
  // Helper to ensure dummy dates don't fall on Sundays for academic work
  const avoidSunday = (offset) => {
    const d = new Date();
    d.setDate(today.getDate() + offset);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Move to Monday if Sunday
    return d;
  };

  const dummyEvents = [
    {
      title: 'Final Semester Examinations',
      description: 'Major university-level theory examinations.',
      type: 'Exam',
      startDate: avoidSunday(15),
      endDate: avoidSunday(15),
      category: 'Academic'
    },
    {
      title: 'Capstone Project Submission',
      description: 'Final deadline for submitting the source code and documentation.',
      type: 'Deadline',
      startDate: avoidSunday(2),
      endDate: avoidSunday(2),
      category: 'Academic'
    },
    {
      title: 'May Day (Public Holiday)',
      description: 'International Workers\' Day - University Closed.',
      type: 'Holiday',
      startDate: new Date(today.getFullYear(), 4, 1), // May 1
      endDate: new Date(today.getFullYear(), 4, 1),
      category: 'Holiday'
    },
    {
      title: 'Blockchain & Web3 Workshop',
      description: '3-day intensive workshop on decentralized applications.',
      type: 'Workshop',
      startDate: avoidSunday(7),
      endDate: avoidSunday(7),
      category: 'Technical'
    },
    {
      title: 'Annual Tech Symposium',
      description: 'Departmental technical event with coding challenges and hackathons.',
      type: 'Event',
      startDate: avoidSunday(12),
      endDate: avoidSunday(12),
      category: 'Technical'
    },
    {
      title: 'Summer Internship Orientation',
      description: 'Mandatory session for 3rd and 4th year students regarding internships.',
      type: 'Workshop',
      startDate: avoidSunday(1),
      endDate: avoidSunday(1),
      category: 'Professional'
    },
    // National & Regional Holidays
    {
      title: 'Republic Day (National Holiday)',
      description: 'Republic Day Celebrations and Flag Hoisting.',
      type: 'Holiday',
      startDate: new Date(today.getFullYear(), 0, 26),
      endDate: new Date(today.getFullYear(), 0, 26),
      category: 'Holiday'
    },
    {
      title: 'Sankranthi / Pongal Holidays',
      description: 'Annual harvest festival holidays.',
      type: 'Holiday',
      startDate: new Date(today.getFullYear(), 0, 14),
      endDate: new Date(today.getFullYear(), 0, 16),
      category: 'Holiday'
    },
    {
      title: 'Independence Day (National Holiday)',
      description: 'Independence Day Celebrations.',
      type: 'Holiday',
      startDate: new Date(today.getFullYear(), 7, 15),
      endDate: new Date(today.getFullYear(), 7, 15),
      category: 'Holiday'
    },
    {
      title: 'Gandhi Jayanti',
      description: 'Birthday of Mahatma Gandhi.',
      type: 'Holiday',
      startDate: new Date(today.getFullYear(), 9, 2),
      endDate: new Date(today.getFullYear(), 9, 2),
      category: 'Holiday'
    },
    {
      title: 'Dasara / Dussehra Holidays',
      description: 'Vijayadashami celebrations.',
      type: 'Holiday',
      startDate: new Date(today.getFullYear(), 9, 20),
      endDate: new Date(today.getFullYear(), 9, 21),
      category: 'Holiday'
    },
    {
      title: 'Diwali / Deepavali',
      description: 'Festival of Lights.',
      type: 'Holiday',
      startDate: new Date(today.getFullYear(), 10, 8),
      endDate: new Date(today.getFullYear(), 10, 9),
      category: 'Holiday'
    }
  ];

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
