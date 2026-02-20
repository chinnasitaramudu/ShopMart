/*
 * File Purpose: Express middleware module (middleware/authMiddleware.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Verify JWT access token and restrict routes by role.
// Authentication flow: bearer token -> jwt.verify -> find user -> attach req.user for downstream controllers.
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Access denied. Missing bearer token.')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      throw new ApiError(401, 'Token is valid but user no longer exists.')
    }

    req.user = user
    req.userId = user._id
    next()
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token.')
  }
})

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You are not authorized for this action.'))
    }

    next()
  }
}
