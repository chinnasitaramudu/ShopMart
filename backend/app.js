/*
 * File Purpose: Express app composition module (app.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Build and configure the Express application with middlewares and route mounting.
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

dotenv.config()

const app = express()
const allowedOrigins = [process.env.CLIENT_URL].filter(Boolean)
const isDev = process.env.NODE_ENV !== 'production'

app.use(
  cors({
    // Allow configured client URL and localhost dev ports to avoid CORS issues during local development.
    origin(origin, callback) {
      if (!origin) return callback(null, true)

      const isAllowed =
        allowedOrigins.includes(origin) ||
        (isDev && /^http:\/\/localhost:\d+$/.test(origin))

      if (isAllowed) return callback(null, true)
      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ShopSmart API is running'
  })
})

app.use('/api', routes)
app.use(notFound)
app.use(errorHandler)

export default app

