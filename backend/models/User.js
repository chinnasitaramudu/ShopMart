/*
 * File Purpose: Mongoose data model module (models/User.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: User schema containing identity, credentials, role, and address.
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { ROLES } from '../constants/roles.js'

const addressSchema = new mongoose.Schema(
  {
    // Primary address line used for shipping.
    address: { type: String, default: '' },
    // City where the user lives.
    city: { type: String, default: '' },
    // State/region value.
    state: { type: String, default: '' },
    // Postal or ZIP code.
    postalCode: { type: String, default: '' },
    // Country name.
    country: { type: String, default: '' }
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    // Full name of the user.
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    // Unique login email used for authentication.
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    // Hashed password (never exposed in API responses by default).
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },
    // Role controls authorization (admin or user).
    role: {
      type: String,
      enum: [ROLES.ADMIN, ROLES.USER],
      default: ROLES.USER
    },
    // Optional pointer to the user's active cart document.
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
      default: null
    },
    // Nested address object for shipping/profile details.
    address: {
      type: addressSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true
  }
)

// Hash password before save to avoid storing plaintext credentials.
userSchema.pre('save', async function savePassword(next) {
  if (!this.isModified('password')) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
