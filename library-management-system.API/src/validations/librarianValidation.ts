import Joi from "joi"; // Import Joi validation library

/**
 * @swagger
 * components:
 *   schemas:
 *     Librarian:
 *       type: object
 *       required:
 *         - Librarian_ID
 *         - Name
 *         - Email
 *         - Phone_Number
 *       properties:
 *         Librarian_ID:
 *           type: number
 *           description: Unique identifier for the librarian
 *           example: 101
 *         Name:
 *           type: string
 *           description: Name of the librarian
 *           example: "John Doe"
 *         Email:
 *           type: string
 *           format: email
 *           description: Librarian's email address
 *           example: "johndoe@example.com"
 *         Phone_Number:
 *           type: number
 *           description: Librarian's phone number
 *           example: 1234567890
 *     LibrarianResponse:
 *       type: object
 *       properties:
 *         Librarian_ID:
 *           type: number
 *         Name:
 *           type: string
 *         Email:
 *           type: string
 *         Phone_Number:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
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


// Define a validation schema for librarian data
const librarianValidationSchema = Joi.object({
  // Librarian ID validation
  // - Must be a number
  // - Required field
  Librarian_ID: Joi.number().required().messages({
    "number.base": "Librarian ID must be a number",
    "any.required": "Librarian ID is required",
  }),

  // Name validation
  // - Must be a string
  // - Maximum 100 characters
  // - Required field
  Name: Joi.string().max(100).required().messages({
    "string.base": "Name must be a string",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),

  // Email validation
  // - Must be a valid email format
  // - Required field
  Email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  // Phone number validation
  // - Must be a number
  // - Required field
  Phone_Number: Joi.number().required().messages({
    "number.base": "Phone Number must be a number",
    "any.required": "Phone Number is required",
  }),
});

// Helper function to validate librarian data
// - Takes librarian data as input
// - Returns validation result with all errors (abortEarly: false)
// - Type 'any' is used for librarianData as it's raw input that needs validation
export const validateLibrarian = (librarianData: any) => {
  return librarianValidationSchema.validate(librarianData, { abortEarly: false });
};
