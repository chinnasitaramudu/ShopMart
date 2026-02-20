/*
 * File Purpose: Request controller module (controllers/productController.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Product browse/search endpoints and admin product CRUD operations.
import mongoose from 'mongoose'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const buildSort = (sort) => {
  switch (sort) {
    case 'priceAsc':
      return { price: 1 }
    case 'priceDesc':
      return { price: -1 }
    case 'titleAsc':
    case 'nameAsc':
      return { title: 1 }
    case 'oldest':
      return { createdAt: 1 }
    default:
      return { createdAt: -1 }
  }
}

export const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    limit = 12
  } = req.query

  const query = {}

  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } }
    ]
  }

  if (category && mongoose.Types.ObjectId.isValid(category)) {
    query.category = category
  } else if (category) {
    // Support category filters from frontend slugs like "vegetables", "rice", etc.
    const normalizedCategory = String(category).replace(/[-_]/g, ' ').trim()
    const categoryDoc = await Category.findOne({
      name: { $regex: `^${escapeRegex(normalizedCategory)}$`, $options: 'i' }
    }).select('_id')

    // If category text is invalid, return empty list instead of mixed/unfiltered results.
    if (!categoryDoc) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: {
          total: 0,
          page: Math.max(1, Number(page)),
          pages: 1,
          limit: Math.max(1, Number(limit))
        }
      })
    }

    query.category = categoryDoc._id
  }

  if (minPrice || maxPrice) {
    query.price = {}
    if (minPrice) query.price.$gte = Number(minPrice)
    if (maxPrice) query.price.$lte = Number(maxPrice)
  }

  const currentPage = Math.max(1, Number(page))
  const pageLimit = Math.max(1, Number(limit))

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name')
      .sort(buildSort(sort))
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit),
    Product.countDocuments(query)
  ])

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      total,
      page: currentPage,
      pages: Math.max(1, Math.ceil(total / pageLimit)),
      limit: pageLimit
    }
  })
})

export const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, 'Invalid product id.')
  }

  const product = await Product.findById(req.params.id).populate('category', 'name')
  if (!product) {
    throw new ApiError(404, 'Product not found.')
  }

  res.status(200).json({
    success: true,
    data: product
  })
})

export const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    name,
    description,
    category,
    price,
    stock,
    image,
    images
  } = req.body

  const normalizedTitle = title || name
  const normalizedImage = image || (Array.isArray(images) ? images[0] : '')

  if (!normalizedTitle || !description || !category || price === undefined || stock === undefined || !normalizedImage) {
    throw new ApiError(400, 'title, description, category, price, stock, and image are required.')
  }

  if (!mongoose.Types.ObjectId.isValid(category)) {
    throw new ApiError(400, 'Invalid category id.')
  }

  const categoryExists = await Category.findById(category)
  if (!categoryExists) {
    throw new ApiError(400, 'Category not found.')
  }

  const product = await Product.create({
    title: normalizedTitle,
    description,
    category,
    price,
    stock,
    image: normalizedImage
  })

  res.status(201).json({
    success: true,
    message: 'Product created successfully.',
    data: product
  })
})

export const updateProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, 'Invalid product id.')
  }

  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new ApiError(404, 'Product not found.')
  }

  const {
    title,
    name,
    description,
    category,
    price,
    stock,
    image,
    images
  } = req.body

  if (category !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      throw new ApiError(400, 'Invalid category id.')
    }
    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      throw new ApiError(400, 'Category not found.')
    }
    product.category = category
  }

  if (title !== undefined) product.title = title
  if (name !== undefined) product.title = name
  if (description !== undefined) product.description = description
  if (price !== undefined) product.price = price
  if (stock !== undefined) product.stock = stock
  if (image !== undefined) product.image = image
  if (images !== undefined && Array.isArray(images) && images[0]) product.image = images[0]

  await product.save()

  res.status(200).json({
    success: true,
    message: 'Product updated successfully.',
    data: product
  })
})

export const deleteProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, 'Invalid product id.')
  }

  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new ApiError(404, 'Product not found.')
  }

  await product.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully.'
  })
})
