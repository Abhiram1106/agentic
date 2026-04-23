const express = require('express');
const router = express.Router();
const {
  createExam,
  createElective,
  createPolicy,
  createEvent,
  createTimetable
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.post('/exams', createExam);
router.post('/electives', createElective);
router.post('/policies', createPolicy);
router.post('/calendar', createEvent);
router.post('/timetable', createTimetable);

module.exports = router;
