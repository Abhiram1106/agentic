const express = require('express');
const router = express.Router();
const {
  getExams,
  getElectives,
  getPolicies,
  getCalendar,
  getReminders,
  getNotifications,
  getTimetable
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/exams', getExams);
router.get('/electives', getElectives);
router.get('/policies', getPolicies);
router.get('/calendar', getCalendar);
router.get('/reminders', getReminders);
router.get('/notifications', getNotifications);
router.get('/timetable', getTimetable);

module.exports = router;
