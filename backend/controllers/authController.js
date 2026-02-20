/*
 * File Purpose: Request controller module (controllers/authController.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Authentication and self-profile endpoints for users.
// Authentication flow: register/login returns JWT -> frontend stores token -> protected routes verify token.
import User from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { generateToken } from '../utils/generateToken.js'

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  address: user.address,
  createdAt: user.createdAt
})

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required.')
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    throw new ApiError(409, 'User already exists with this email.')
  }

  const user = await User.create({ name, email: email.toLowerCase(), password })
  const token = generateToken(user._id, user.role)

  res.status(201).json({
    success: true,
    message: 'Registration successful.',
    data: {
      user: sanitizeUser(user),
      token
    }
  })
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.')
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.')
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.')
  }

  const token = generateToken(user._id, user.role)
  const safeUser = await User.findById(user._id)

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: {
      user: sanitizeUser(safeUser),
      token
    }
  })
})

export const getMyProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  })
})

export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password')
  if (!user) {
    throw new ApiError(404, 'User not found.')
  }

  const { name, phone, address, password } = req.body

  if (name !== undefined) user.name = name
  if (phone !== undefined) user.phone = phone
  if (address !== undefined) user.address = address
  if (password !== undefined && password.trim() !== '') user.password = password

  const updatedUser = await user.save()

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: sanitizeUser(updatedUser)
  })
})
