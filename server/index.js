require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for easier development if needed
}));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Student Support Agent API is running...');
});

// Auth Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
// Student Routes
app.use('/api/student', require('./src/routes/studentRoutes'));
// Admin Routes
app.use('/api/admin', require('./src/routes/adminRoutes'));
// Assistant Routes
app.use('/api/assistant', require('./src/routes/assistantRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('--- SERVER ERROR ---');
  console.error(err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
