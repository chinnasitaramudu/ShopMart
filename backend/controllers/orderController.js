/*
 * File Purpose: Request controller module (controllers/orderController.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Place orders from user-specific cart, fetch order history, and manage order status/payment.
import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const calculateOrderTotal = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal > 600 ? 0 : 40
  const tax = Number((subtotal * 0.05).toFixed(2))
  const total = Number((subtotal + shippingFee + tax).toFixed(2))
  return { subtotal, shippingFee, tax, total }
}

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'cod' } = req.body

  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
    throw new ApiError(400, 'Complete shipping address is required.')
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title price image stock')
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty. Add items before placing order.')
  }

  const orderItems = []
  const stockUpdates = []

  for (const cartItem of cart.items) {
    const product = cartItem.product

    if (!product) {
      throw new ApiError(400, 'Cart has invalid product references. Please refresh cart.')
    }

    if (product.stock < cartItem.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.title}.`)
    }

    orderItems.push({
      product: product._id,
      title: product.title,
      quantity: cartItem.quantity,
      price: product.price,
      image: product.image
    })

    stockUpdates.push({
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -cartItem.quantity } }
      }
    })
  }

  const { total } = calculateOrderTotal(orderItems)

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    total,
    status: 'pending',
    paymentInfo: {
      method: paymentMethod,
      status: paymentMethod === 'cod' ? 'PENDING' : 'INITIATED'
    },
    shippingAddress
  })

  if (stockUpdates.length > 0) {
    await Product.bulkWrite(stockUpdates)
  }

  cart.items = []
  await cart.save()

  res.status(201).json({
    success: true,
    message: 'Order placed successfully.',
    data: order
  })
})

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    data: orders
  })
})

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'title image price')

  if (!order) {
    throw new ApiError(404, 'Order not found.')
  }

  const isOwner = order.user._id.toString() === req.user._id.toString()
  const isAdmin = req.user.role === 'admin'

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'Not authorized to view this order.')
  }

  res.status(200).json({
    success: true,
    data: order
  })
})

export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    throw new ApiError(404, 'Order not found.')
  }

  const isOwner = order.user.toString() === req.user._id.toString()
  const isAdmin = req.user.role === 'admin'
  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'Not authorized to update payment for this order.')
  }

  order.paymentInfo = {
    method: order.paymentInfo?.method || 'mock',
    transactionId: req.body.id || `mock_${order._id}`,
    status: req.body.status || 'COMPLETED',
    paidAt: new Date()
  }

  if (order.status === 'pending') {
    order.status = 'processing'
  }

  await order.save()

  res.status(200).json({
    success: true,
    message: 'Order marked as paid.',
    data: order
  })
})

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    data: orders
  })
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  if (!status) {
    throw new ApiError(400, 'status is required.')
  }

  const order = await Order.findById(req.params.id)
  if (!order) {
    throw new ApiError(404, 'Order not found.')
  }

  order.status = status
  await order.save()

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully.',
    data: order
  })
})
