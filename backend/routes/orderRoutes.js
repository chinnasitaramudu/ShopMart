/*
 * File Purpose: Express route module (routes/orderRoutes.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Order routes for users and admin order processing.
import express from 'express'
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  updateOrderToPaid
} from '../controllers/orderController.js'
import { authorize, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, createOrder)
router.get('/my-orders', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.put('/:id/pay', protect, updateOrderToPaid)

router.get('/', protect, authorize('admin'), getOrders)
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus)

export default router
