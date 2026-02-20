/*
 * File Purpose: Request controller module (controllers/userController.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Admin-only user management endpoints.
import User from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    data: users
  })
})

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (!user) {
    throw new ApiError(404, 'User not found.')
  }

  res.status(200).json({
    success: true,
    data: user
  })
})

export const updateUserById = asyncHandler(async (req, res) => {
  const { name, email, role, phone, address } = req.body

  const user = await User.findById(req.params.id).select('+password')
  if (!user) {
    throw new ApiError(404, 'User not found.')
  }

  if (name !== undefined) user.name = name
  if (email !== undefined) user.email = email.toLowerCase()
  if (role !== undefined) user.role = role
  if (phone !== undefined) user.phone = phone
  if (address !== undefined) user.address = address

  await user.save()

  const safeUser = await User.findById(req.params.id).select('-password')

  res.status(200).json({
    success: true,
    message: 'User updated successfully.',
    data: safeUser
  })
})

export const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    throw new ApiError(404, 'User not found.')
  }

  await user.deleteOne()

  res.status(200).json({
    success: true,
    message: 'User deleted successfully.'
  })
})
