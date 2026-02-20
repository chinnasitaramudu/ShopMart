/*
 * File Purpose: Express route module (routes/index.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Aggregate and mount all feature routes under /api namespace.
import express from 'express'
import adminRoutes from './adminRoutes.js'
import authRoutes from './authRoutes.js'
import cartRoutes from './cartRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import orderRoutes from './orderRoutes.js'
import productRoutes from './productRoutes.js'
import userRoutes from './userRoutes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/categories', categoryRoutes)
router.use('/products', productRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)
router.use('/admin', adminRoutes)

export default router
