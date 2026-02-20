/*
 * File Purpose: Request controller module (controllers/cartController.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: User-specific cart operations (get/add/update/remove/clear).
import mongoose from 'mongoose'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

const calculateCartTotals = (cart) => {
  const totals = cart.items.reduce(
    (acc, item) => {
      const unitPrice = item.product?.price || 0
      acc.itemsCount += item.quantity
      acc.subtotal += unitPrice * item.quantity
      return acc
    },
    { itemsCount: 0, subtotal: 0 }
  )

  return {
    itemsCount: totals.itemsCount,
    subtotal: Number(totals.subtotal.toFixed(2))
  }
}

const ensureCart = async (userId) => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId, items: [] } },
    { new: true, upsert: true }
  )

  await User.findByIdAndUpdate(userId, { cart: cart._id })
  return cart
}

const loadPopulatedCart = async (userId) => {
  const cart = await ensureCart(userId)
  await cart.populate('items.product', 'title price image stock')
  return cart
}

export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await loadPopulatedCart(req.user._id)

  res.status(200).json({
    success: true,
    data: {
      ...cart.toObject(),
      ...calculateCartTotals(cart)
    }
  })
})

export const addItemToCart = asyncHandler(async (req, res) => {
  const productId = req.body.productId || req.body.product
  const quantity = Math.max(1, Number(req.body.quantity || req.body.qty || 1))

  if (!productId || !isValidObjectId(productId)) {
    throw new ApiError(400, 'Invalid product id. Expected MongoDB ObjectId.')
  }

  const product = await Product.findById(productId)
  if (!product) {
    throw new ApiError(404, 'Product not found.')
  }

  const cart = await ensureCart(req.user._id)
  const existingItem = cart.items.find((item) => item.product.toString() === productId)

  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock)
  } else {
    cart.items.push({
      product: product._id,
      quantity: Math.min(quantity, product.stock)
    })
  }

  await cart.save()
  const populated = await loadPopulatedCart(req.user._id)

  res.status(200).json({
    success: true,
    message: 'Item added to cart.',
    data: {
      ...populated.toObject(),
      ...calculateCartTotals(populated)
    }
  })
})

export const updateCartItem = asyncHandler(async (req, res) => {
  const productId = req.params.productId
  const quantity = Math.max(1, Number(req.body.quantity || req.body.qty || 1))

  if (!isValidObjectId(productId)) {
    throw new ApiError(400, 'Invalid product id. Expected MongoDB ObjectId.')
  }

  const product = await Product.findById(productId)
  if (!product) {
    throw new ApiError(404, 'Product not found.')
  }

  const cart = await ensureCart(req.user._id)
  const existingItem = cart.items.find((item) => item.product.toString() === productId)

  if (!existingItem) {
    throw new ApiError(404, 'Item not present in cart.')
  }

  existingItem.quantity = Math.min(quantity, product.stock)
  await cart.save()

  const populated = await loadPopulatedCart(req.user._id)

  res.status(200).json({
    success: true,
    message: 'Cart item updated.',
    data: {
      ...populated.toObject(),
      ...calculateCartTotals(populated)
    }
  })
})

export const removeCartItem = asyncHandler(async (req, res) => {
  const productId = req.params.productId

  if (!isValidObjectId(productId)) {
    throw new ApiError(400, 'Invalid product id. Expected MongoDB ObjectId.')
  }

  const cart = await ensureCart(req.user._id)
  cart.items = cart.items.filter((item) => item.product.toString() !== productId)
  await cart.save()

  const populated = await loadPopulatedCart(req.user._id)

  res.status(200).json({
    success: true,
    message: 'Item removed from cart.',
    data: {
      ...populated.toObject(),
      ...calculateCartTotals(populated)
    }
  })
})

export const clearMyCart = asyncHandler(async (req, res) => {
  const cart = await ensureCart(req.user._id)
  cart.items = []
  await cart.save()

  const populated = await loadPopulatedCart(req.user._id)

  res.status(200).json({
    success: true,
    message: 'Cart cleared.',
    data: {
      ...populated.toObject(),
      ...calculateCartTotals(populated)
    }
  })
})
