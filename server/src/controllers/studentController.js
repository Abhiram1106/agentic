const Exam = require('../models/Exam');
const Elective = require('../models/Elective');
const Policy = require('../models/Policy');
const CalendarEvent = require('../models/CalendarEvent');
const Reminder = require('../models/Reminder');
const Notification = require('../models/Notification');
const StudentProfile = require('../models/StudentProfile');
const Timetable = require('../models/Timetable');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

const CALENDAR_FILE_PATH = path.join(__dirname, '../../../vignan_academic_calendar_2025_26.json');

const toDateEvent = (dateStr, title, type, description) => ({
  startDate: new Date(dateStr),
  endDate: new Date(dateStr),
  title,
  description,
  type,
  category: type === 'Holiday' ? 'Holiday' : 'Academic'
});

const assessmentTypeToEventType = (assessmentType) => {
  if (assessmentType.toLowerCase().includes('summative assessment')) {
    return 'Exam';
  }
  return 'Deadline';
};

const buildEventsFromAcademicCalendar = () => {
  const raw = fs.readFileSync(CALENDAR_FILE_PATH, 'utf-8');
  const calendarJson = JSON.parse(raw);
  const years = calendarJson?.years || {};
  const events = [];

  Object.values(years).forEach((yearBlock) => {
    const yearLabel = yearBlock?.label || 'Academic Year';

    Object.entries(yearBlock).forEach(([semesterKey, semesterBlock]) => {
      if (!semesterKey.startsWith('semester_') || !semesterBlock || typeof semesterBlock !== 'object') {
        return;
      }

      const semesterLabel = semesterKey.replace('_', ' ').toUpperCase();
      const prefix = `${yearLabel} - ${semesterLabel}`;

      const milestoneFields = [
        ['orientation', 'Orientation Session'],
        ['pre_semester_commencement', 'Pre-Semester Commencement'],
        ['module_1_commencement', 'Module-1 Commencement'],
        ['module_2_commencement', 'Module-2 Commencement']
      ];

      milestoneFields.forEach(([fieldName, readableName]) => {
        if (semesterBlock[fieldName]) {
          events.push(
            toDateEvent(
              semesterBlock[fieldName],
              `${prefix}: ${readableName}`,
              'Academic',
              `${readableName} for ${yearLabel}`
            )
          );
        }
      });

      const keyEvents = semesterBlock.key_events || {};

      (keyEvents.holidays || []).forEach((holiday) => {
        if (!holiday?.date || !holiday?.name) return;
        events.push(
          toDateEvent(
            holiday.date,
            `${prefix}: ${holiday.name}`,
            'Holiday',
            `Holiday: ${holiday.name}`
          )
        );
      });

      (keyEvents.working_sundays || []).forEach((workingDay) => {
        if (!workingDay?.date) return;
        events.push(
          toDateEvent(
            workingDay.date,
            `${prefix}: Working Day`,
            'Event',
            workingDay.reason || 'Marked as working day in academic calendar'
          )
        );
      });

      (keyEvents.assessments || []).forEach((assessment) => {
        if (!assessment?.type) return;

        const eventType = assessmentTypeToEventType(assessment.type);

        if (Array.isArray(assessment.dates)) {
          assessment.dates.forEach((dateStr) => {
            events.push(
              toDateEvent(
                dateStr,
                `${prefix}: ${assessment.type}`,
                eventType,
                `${assessment.type} for ${yearLabel}`
              )
            );
          });
        }

        if (assessment.date_range?.start && assessment.date_range?.end) {
          events.push({
            startDate: new Date(assessment.date_range.start),
            endDate: new Date(assessment.date_range.end),
            title: `${prefix}: ${assessment.type}`,
            description: `${assessment.type} (${assessment.date_range.start} to ${assessment.date_range.end})`,
            type: eventType,
            category: 'Academic'
          });
        }
      });
    });
  });

  return events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
};

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
  try {
    const fallbackEvents = buildEventsFromAcademicCalendar();
    return res.json(fallbackEvents);
  } catch (error) {
    console.error('Failed to build calendar from JSON source:', error.message);
    return res.status(500).json({ message: 'Unable to load academic calendar data' });
  }
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
