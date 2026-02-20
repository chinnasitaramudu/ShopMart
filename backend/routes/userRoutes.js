/*
 * File Purpose: Express route module (routes/userRoutes.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Admin user management routes.
import express from 'express'
import { deleteUserById, getUserById, getUsers, updateUserById } from '../controllers/userController.js'
import { authorize, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect, authorize('admin'))
router.get('/', getUsers)
router.get('/:id', getUserById)
router.put('/:id', updateUserById)
router.delete('/:id', deleteUserById)

export default router
