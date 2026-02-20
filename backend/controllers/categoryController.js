/*
 * File Purpose: Request controller module (controllers/categoryController.js).
 * MongoDB Connection: config/db.js opens the MongoDB connection once at startup using MONGO_URI; this file relies on that shared Mongoose connection.
 * Routes to Controllers: route modules map HTTP endpoints to controller functions; controllers execute business logic and return JSON responses.
 * JWT Middleware: middleware/authMiddleware.js validates the Bearer token and attaches req.user before protected handlers run.
 * Models and Database: Mongoose models define schemas and CRUD/query methods used by controllers/services for database persistence.
 * Frontend API Usage: the React frontend calls /api endpoints through Axios services and consumes JSON responses from these handlers.
 */
// Purpose: Category CRUD endpoints for product classification.
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body

  if (!name) {
    throw new ApiError(400, 'Category name is required.')
  }

  const existing = await Category.findOne({ name: name.trim() })
  if (existing) {
    throw new ApiError(409, 'Category with this name already exists.')
  }

  const category = await Category.create({ name: name.trim(), description })

  res.status(201).json({
    success: true,
    message: 'Category created successfully.',
    data: category
  })
})

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    data: categories
  })
})

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    throw new ApiError(404, 'Category not found.')
  }

  res.status(200).json({
    success: true,
    data: category
  })
})

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    throw new ApiError(404, 'Category not found.')
  }

  const { name, description } = req.body
  if (name !== undefined) category.name = name.trim()
  if (description !== undefined) category.description = description

  await category.save()

  res.status(200).json({
    success: true,
    message: 'Category updated successfully.',
    data: category
  })
})

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    throw new ApiError(404, 'Category not found.')
  }

  const linkedProducts = await Product.countDocuments({ category: category._id })
  if (linkedProducts > 0) {
    throw new ApiError(400, 'Cannot delete category that is linked to products.')
  }

  await category.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully.'
  })
})
