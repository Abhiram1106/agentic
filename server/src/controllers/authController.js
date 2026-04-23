const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    const profile = await StudentProfile.findOne({ user: user._id });
    
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      profile: profile || null,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { 
    email, 
    password, 
    fullName, 
    rollNumber, 
    department, 
    year, 
    semester, 
    section 
  } = req.body;

  // Validation
  if (!email || !password || !fullName || !rollNumber || !department || !year || !semester || !section) {
    res.status(400);
    throw new Error('Please include all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const profileExists = await StudentProfile.findOne({ rollNumber });
  if (profileExists) {
    res.status(400);
    throw new Error('User with this roll number already exists');
  }

  // Create User
  let user;
  try {
    user = await User.create({
      email,
      password,
    });
  } catch (error) {
    res.status(400);
    throw new Error('Invalid user details. Could not create account.');
  }

  if (user) {
    try {
      // Create Student Profile
      const profile = await StudentProfile.create({
        user: user._id,
        fullName,
        rollNumber,
        department,
        year: Number(year),
        semester: Number(semester),
        section
      });

      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        profile,
        token: generateToken(user._id),
      });
    } catch (error) {
      // Cleanup: Delete the user if profile creation fails
      if (user && user._id) {
          await User.findByIdAndDelete(user._id);
      }
      console.error('Profile creation error:', error);
      res.status(400);
      throw new Error(`Profile creation failed: ${error.message}`);
    }
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const profile = await StudentProfile.findOne({ user: user._id });
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      profile
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
};
