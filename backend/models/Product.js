/*
 * File Purpose: Mongoose data model module (models/Product.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Product schema for catalog items shown in grocery listing and details pages.
import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    // Public product title shown in catalog cards.
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true
    },
    // Product details/description text.
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    // Category reference (can point to Category collection).
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    // Selling price.
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    // Available stock quantity.
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: 0,
      default: 0
    },
    // Main image URL used on product card/details page.
    image: {
      type: String,
      required: [true, 'Product image is required'],
      default: ''
    }
  },
  {
    timestamps: true
  }
)

// Backward compatibility alias for code expecting `name`.
productSchema.virtual('name')
  .get(function getName() {
    return this.title
  })
  .set(function setName(value) {
    this.title = value
  })

// Backward compatibility alias for code expecting `images` array.
productSchema.virtual('images')
  .get(function getImages() {
    return this.image ? [this.image] : []
  })
  .set(function setImages(value) {
    if (Array.isArray(value) && value.length > 0) {
      this.image = value[0]
      return
    }
    if (typeof value === 'string') {
      this.image = value
    }
  })

productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })

const Product = mongoose.model('Product', productSchema)

export default Product
