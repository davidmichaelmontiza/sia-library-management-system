import Joi from "joi"; // Import Joi validation library

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
