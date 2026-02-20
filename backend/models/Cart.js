/*
 * File Purpose: Mongoose data model module (models/Cart.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: User-specific cart schema so each authenticated user has an isolated cart.
import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema(
  {
    // Product reference stored as ObjectId.
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    // Quantity selected by user.
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
  },
  { _id: false }
)

const cartSchema = new mongoose.Schema(
  {
    // Owner of this cart; unique ensures one cart per user.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    // Cart line items.
    items: {
      type: [cartItemSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
)

const Cart = mongoose.model('Cart', cartSchema)

export default Cart
