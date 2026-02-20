/*
 * File Purpose: Backend utility module (utils/ApiError.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Custom API error class to standardize HTTP error responses.
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}
