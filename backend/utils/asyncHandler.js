/*
 * File Purpose: Backend utility module (utils/asyncHandler.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Wrap async route handlers so thrown errors are forwarded to global error middleware.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
