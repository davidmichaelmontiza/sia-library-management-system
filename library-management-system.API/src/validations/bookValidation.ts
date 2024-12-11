import Joi from "joi"; // Import Joi validation library

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - Book_ID
 *         - Student_ID
 *         - Title
 *         - Author
 *         - Publisher
 *         - Year_of_Publication
 *         - Available_Copies
 *         - Total_Copies
 *         - Category_ID
 *         - Shelf_ID
 *       properties:
 *         Book_ID:
 *           type: number
 *           description: Unique identifier for the book
 *           example: 101
 *         Student_ID:
 *           type: number
 *           description: Identifier for the student associated with the book
 *           example: 1001
 *         Title:
 *           type: string
 *           description: Title of the book
 *           example: "Introduction to Algorithms"
 *         Author:
 *           type: string
 *           description: Author of the book
 *           example: "Thomas H. Cormen"
 *         Publisher:
 *           type: string
 *           description: Publisher of the book
 *           example: "MIT Press"
 *         Year_of_Publication:
 *           type: string
 *           format: date
 *           description: Year the book was published
 *           example: "2009-07-31"
 *         Available_Copies:
 *           type: number
 *           description: Number of available copies
 *           example: 5
 *         Total_Copies:
 *           type: number
 *           description: Total number of copies
 *           example: 10
 *         Category_ID:
 *           type: number
 *           description: Identifier for the category of the book
 *           example: 3
 *         Shelf_ID:
 *           type: number
 *           description: Identifier for the shelf where the book is stored
 *           example: 12
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               path:
 *                 type: array
 *                 items:
 *                   type: string
 */



// Define a validation schema for book data
const bookValidationSchema = Joi.object({
  // Book ID validation
  // - Must be a positive number
  // - Required field
  Book_ID: Joi.number().positive().required().messages({
    "number.base": "Book ID must be a number",
    "number.positive": "Book ID must be a positive number",
    "any.required": "Book ID is required",
  }),

  // Student ID validation
  // - Must be a positive number
  Student_ID: Joi.number().positive().optional().messages({
    "number.base": "Student ID must be a number",
    "number.positive": "Student ID must be a positive number",
  }),

  // Title validation
  // - Maximum 200 characters
  // - Required field
  Title: Joi.string().max(200).required().messages({
    "string.base": "Title must be a string",
    "string.max": "Title cannot exceed 200 characters",
    "any.required": "Title is required",
  }),

  // Author validation
  // - Maximum 100 characters
  // - Required field
  Author: Joi.string().max(100).required().messages({
    "string.base": "Author must be a string",
    "string.max": "Author cannot exceed 100 characters",
    "any.required": "Author is required",
  }),

  // Publisher validation
  // - Maximum 100 characters
  // - Optional field
  Publisher: Joi.string().max(100).optional().messages({
    "string.base": "Publisher must be a string",
    "string.max": "Publisher cannot exceed 100 characters",
  }),

  // Year of Publication validation
  // - Must be a valid date
  // - Optional field
  Year_of_Publication: Joi.date().optional().messages({
    "date.base": "Year of Publication must be a valid date",
  }),

  // Available Copies validation
  // - Must be a non-negative number
  // - Required field
  Available_Copies: Joi.number().integer().min(0).required().messages({
    "number.base": "Available Copies must be a number",
    "number.min": "Available Copies cannot be negative",
    "any.required": "Available Copies is required",
  }),

  // Total Copies validation
  // - Must be a non-negative number
  // - Required field
  Total_Copies: Joi.number().integer().min(0).required().messages({
    "number.base": "Total Copies must be a number",
    "number.min": "Total Copies cannot be negative",
    "any.required": "Total Copies is required",
  }),

  // Category ID validation
  // - Must be a positive number
  // - Required field
  Category_ID: Joi.number().positive().required().messages({
    "number.base": "Category ID must be a number",
    "number.positive": "Category ID must be a positive number",
    "any.required": "Category ID is required",
  }),

  // Shelf ID validation
  // - Must be a positive number
  // - Required field
  Shelf_ID: Joi.number().positive().required().messages({
    "number.base": "Shelf ID must be a number",
    "number.positive": "Shelf ID must be a positive number",
    "any.required": "Shelf ID is required",
  }),
});

// Helper function to validate book data
export const validateBook = (bookData: any) => {
  return bookValidationSchema.validate(bookData, { abortEarly: false });
};
