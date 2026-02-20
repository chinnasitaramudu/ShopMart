/*
 * File Purpose: Express route module (routes/productRoutes.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Product browsing routes for users and product CRUD routes for admins.
import express from 'express'
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from '../controllers/productController.js'
import { authorize, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', protect, authorize('admin'), createProduct)
router.put('/:id', protect, authorize('admin'), updateProduct)
router.delete('/:id', protect, authorize('admin'), deleteProduct)

export default router
