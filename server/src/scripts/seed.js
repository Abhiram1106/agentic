require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Exam = require('../models/Exam');
const Elective = require('../models/Elective');
const CalendarEvent = require('../models/CalendarEvent');
const Policy = require('../models/Policy');
const Notification = require('../models/Notification');
const Reminder = require('../models/Reminder');
const Registration = require('../models/Registration');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await StudentProfile.deleteMany();
    await Exam.deleteMany();
    await Elective.deleteMany();
    await CalendarEvent.deleteMany();
    await Policy.deleteMany();
    await Notification.deleteMany();
    await Reminder.deleteMany();
    await Registration.deleteMany();

    console.log('Cleared existing data...');

    // 1. Create Admin
    const adminUser = await User.create({
      email: 'admin@college.edu',
      password: 'password123',
      role: 'admin'
    });

    // 2. Create 10 Students
    const students = [];
    for (let i = 1; i <= 10; i++) {
      const user = await User.create({
        email: `student${i}@college.edu`,
        password: 'password123',
        role: 'student'
      });
      
      const profile = await StudentProfile.create({
        user: user._id,
        fullName: `Student ${i}`,
        rollNumber: `ROLL${1000 + i}`,
        department: i <= 5 ? 'Computer Science' : 'Information Technology',
        year: (i % 4) + 1,
        semester: (i % 8) + 1,
        section: i % 2 === 0 ? 'A' : 'B'
      });
      students.push({ user, profile });
    }
    console.log('Created 10 student accounts...');

    // 3. Create 10 Exams
    const examSubjects = [
      'Data Structures', 'Algorithms', 'Web Development', 'Machine Learning', 
      'Cyber Security', 'Operating Systems', 'Computer Networks', 
      'Cloud Computing', 'Database Systems', 'Software Engineering'
    ];
    const exams = examSubjects.map((subject, i) => ({
      title: i % 2 === 0 ? 'Mid-Semester Examination' : 'End-Semester Examination',
      subject,
      date: new Date(Date.now() + (i + 5) * 24 * 60 * 60 * 1000),
      time: i % 2 === 0 ? '09:00 AM - 12:00 PM' : '02:00 PM - 05:00 PM',
      location: `LH-${100 + i}`,
      department: i < 5 ? 'Computer Science' : 'Information Technology',
      year: (i % 4) + 1,
      semester: (i % 8) + 1
    }));
    await Exam.create(exams);
    console.log('Created 10 exam records...');

    // 4. Create 10 Electives
    const electiveNames = [
      'Advanced AI', 'Mobile App Dev', 'Big Data Analytics', 'IoT Systems', 
      'Game Development', 'Full Stack JS', 'DevOps Culture', 'UI/UX Design', 
      'Embedded Systems', 'Network Security'
    ];
    const electives = electiveNames.map((name, i) => ({
      name,
      faculty: `Dr. Expert ${i + 1}`,
      credits: (i % 3) + 2,
      seatsAvailable: 10 + i,
      totalSeats: 50,
      departmentEligibility: i % 3 === 0 ? ['Any'] : ['Computer Science', 'Information Technology'],
      yearEligibility: [3, 4],
      description: `Comprehensive course on ${name} for aspiring engineers.`,
      difficulty: i % 3 === 0 ? 'Easy' : (i % 3 === 1 ? 'Medium' : 'Hard'),
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      type: i % 2 === 0 ? 'Professional' : 'Open'
    }));
    await Elective.create(electives);
    console.log('Created 10 elective options...');

    // 5. Create 10 Policies
    const policyTitles = [
      'Attendance Rule', 'Grading Scheme', 'Hostel Conduct', 'Library Usage',
      'Plagiarism Policy', 'Fee Payment', 'Internship Credit', 'Dress Code',
      'Sports Participation', 'Scholarship Eligibility'
    ];
    const policies = policyTitles.map((title, i) => ({
      title,
      category: i % 2 === 0 ? 'Academic' : 'General',
      content: `Standard institutional guidelines regarding ${title}. Detailed terms apply for the academic session 2026.`,
      summary: `Quick summary of ${title} requirements.`
    }));
    await Policy.create(policies);
    console.log('Created 10 academic policies...');

    // 6. Create 10 Calendar Events
    const eventTitles = [
      'Tech Fest 2026', 'Sports Meet', 'Alumni Talk', 'Hiring Drive',
      'Clean Campus Day', 'Holi Celebration', 'Yoga Workshop', 'Code Combat',
      'Annual Day', 'Robotics Expo'
    ];
    const events = eventTitles.map((title, i) => ({
      title,
      description: `Participate in our upcoming ${title} event!`,
      type: i % 3 === 0 ? 'Holiday' : (i % 3 === 1 ? 'Workshop' : 'Event'),
      startDate: new Date(Date.now() + (i * 3) * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + (i * 3 + 1) * 24 * 60 * 60 * 1000),
      category: i % 2 === 0 ? 'Technical' : 'General'
    }));
    await CalendarEvent.create(events);
    console.log('Created 10 calendar events...');

    // 7. Create 10 Notifications for the first student
    const notifications = Array.from({ length: 10 }).map((_, i) => ({
      student: students[0].user._id,
      title: `System Alert ${i + 1}`,
      message: `Heads up! This is important notification number ${i + 1} regarding your course.`,
      type: i % 3 === 0 ? 'Info' : (i % 3 === 1 ? 'Warning' : 'Critical'),
      isRead: i > 5
    }));
    await Notification.create(notifications);
    console.log('Created 10 notifications for the demo student...');

    // 8. Create 10 Reminders for the first student
    const reminders = Array.from({ length: 10 }).map((_, i) => ({
      student: students[0].user._id,
      title: `Task: ${electiveNames[i]} Assignment`,
      dueDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
      status: i % 3 === 0 ? 'Completed' : 'Active'
    }));
    await Reminder.create(reminders);
    console.log('Created 10 reminders for the demo student...');

    // 9. Create 10 Registrations (linking students to electives)
    const createdElectives = await Elective.find({});
    const registrations = students.map((s, i) => ({
      student: s.user._id,
      elective: createdElectives[i % createdElectives.length]._id,
      status: i % 3 === 0 ? 'Approved' : 'Pending'
    }));
    await Registration.create(registrations);
    console.log('Created 10 elective registrations...');

    console.log('\n====================================');
    console.log('DATABASE SEEDED SUCCESSFULLY!');
    console.log('Total Records Generated: >80');
    console.log('Demo Account: student1@college.edu / password123');
    console.log('Admin Account: admin@college.edu / password123');
    console.log('====================================');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
