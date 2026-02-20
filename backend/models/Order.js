/*
 * File Purpose: Mongoose data model module (models/Order.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Order schema for user purchases, ordered items, totals, and payment status.
import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    // Linked product id for traceability.
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    // Product title at order time (snapshot). Alias keeps legacy `name` payloads working.
    title: { type: String, required: true, alias: 'name' },
    // Quantity ordered. Alias keeps legacy `qty` payloads working.
    quantity: { type: Number, required: true, min: 1, alias: 'qty' },
    // Unit price at order time.
    price: { type: Number, required: true, min: 0 },
    // Product image snapshot.
    image: { type: String, default: '' },
  },
  { _id: false }
)

const paymentInfoSchema = new mongoose.Schema(
  {
    // Payment method selected by user (cod, card, upi, mock, etc.).
    method: { type: String, default: 'cod' },
    // Transaction id from payment gateway (if available).
    transactionId: { type: String, default: '' },
    // Payment status for order settlement.
    status: { type: String, default: '' },
    // Optional payment metadata.
    paidAt: { type: Date }
  },
  { _id: false }
)

const shippingAddressSchema = new mongoose.Schema(
  {
    // Delivery address line.
    address: { type: String, required: true },
    // Delivery city.
    city: { type: String, required: true },
    // Postal code.
    postalCode: { type: String, required: true },
    // Country.
    country: { type: String, required: true }
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    // User who placed the order.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Array of purchased items.
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: 'Order must have at least one item'
      }
    },
    // Final order amount.
    total: { type: Number, required: true, min: 0 },
    // Order lifecycle status.
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    // Payment information object.
    paymentInfo: {
      type: paymentInfoSchema,
      default: () => ({})
    },
    // Shipping details captured at checkout.
    shippingAddress: {
      type: shippingAddressSchema,
      required: true
    }
  },
  {
    timestamps: true
  }
)

// Backward compatibility aliases for legacy code paths.
orderSchema.virtual('orderItems')
  .get(function getOrderItems() {
    return this.items
  })
  .set(function setOrderItems(value) {
    this.items = value
  })

orderSchema.virtual('totalPrice')
  .get(function getTotalPrice() {
    return this.total
  })
  .set(function setTotalPrice(value) {
    this.total = value
  })

orderSchema.virtual('paymentResult')
  .get(function getPaymentResult() {
    return this.paymentInfo
  })
  .set(function setPaymentResult(value) {
    this.paymentInfo = value
  })

orderSchema.virtual('isPaid').get(function getIsPaid() {
  return this.paymentInfo?.status === 'COMPLETED'
})

orderSchema.virtual('paidAt').get(function getPaidAt() {
  return this.paymentInfo?.paidAt
})

orderSchema.set('toJSON', { virtuals: true })
orderSchema.set('toObject', { virtuals: true })

const Order = mongoose.model('Order', orderSchema)

export default Order
