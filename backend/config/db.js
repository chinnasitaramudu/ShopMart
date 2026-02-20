/*
 * File Purpose: Database configuration module (config/db.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Initialize and maintain MongoDB connection using Mongoose.
// Database connection flow: server startup calls connectDB(), which reads MONGO_URI and opens one shared connection.
import mongoose from 'mongoose'

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Set it in environment variables.')
  }

  mongoose.set('strictQuery', true)

  const connection = await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || undefined
  })

  // Log the active host for quick runtime diagnostics.
  // eslint-disable-next-line no-console
  console.log(`MongoDB connected: ${connection.connection.host}`)
}
