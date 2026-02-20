/*
 * File Purpose: Backend server bootstrap module (server.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Load environment config, connect to MongoDB, and start the backend server.
import dotenv from 'dotenv'
import app from './app.js'
import { connectDB } from './config/db.js'

dotenv.config()

const port = process.env.PORT || 5000

const startServer = async () => {
  try {
    // Database connection is established once before accepting requests.
    await connectDB()

    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`ShopSmart backend listening on port ${port}`)
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Server failed to start:', error.message)
    process.exit(1)
  }
}

startServer()
