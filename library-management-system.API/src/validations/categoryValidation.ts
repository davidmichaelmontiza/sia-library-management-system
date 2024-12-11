import Joi from "joi"; // Import Joi validation library

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - Category_ID
 *         - Category_Name
 *       properties:
 *         Category_ID:
 *           type: number
 *           description: Unique identifier for the category
 *           example: 301
 *         Category_Name:
 *           type: string
 *           description: Name of the category
 *           example: "Fiction"
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Category's unique identifier
 *         Category_ID:
 *           type: number
 *         Category_Name:
 *           type: string
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

// Define a validation schema for category data
const categoryValidationSchema = Joi.object({
  // Category ID validation
  // - Must be a number
  // - Required field
  Category_ID: Joi.number().required().messages({
    "number.base": "Category ID must be a number",
    "any.required": "Category ID is required",
  }),

  // Category Name validation
  // - Maximum 100 characters (or adjust as needed)
  // - Required field
  Category_Name: Joi.string().max(100).required().messages({
    "string.max": "Category Name cannot exceed 100 characters",
    "any.required": "Category Name is required",
  }),
});

// Helper function to validate category data
// - Takes category data as input
// - Returns validation result with all errors (abortEarly: false)
// - Type 'any' is used for categoryData as it's raw input that needs validation
export const validateCategory = (categoryData: any) => {
  return categoryValidationSchema.validate(categoryData, { abortEarly: false });
};
