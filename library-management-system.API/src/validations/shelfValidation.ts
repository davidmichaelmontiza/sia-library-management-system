import Joi from "joi"; // Import Joi validation library

/**
 * @swagger
 * components:
 *   schemas:
 *     Shelf:
 *       type: object
 *       required:
 *         - Shelf_ID
 *         - Shelf_Name
 *         - Category_ID
 *         - Location
 *       properties:
 *         Shelf_ID:
 *           type: number
 *           description: Unique identifier for the shelf
 *           example: 101
 *         Shelf_Name:
 *           type: string
 *           description: Name of the shelf
 *           example: "Fiction Section"
 *         Category_ID:
 *           type: number
 *           description: Unique identifier for the category associated with the shelf
 *           example: 202
 *         Location:
 *           type: string
 *           description: Physical location of the shelf in the library
 *           example: "Second Floor, Aisle 3"
 *     ShelfResponse:
 *       type: object
 *       properties:
 *         Shelf_ID:
 *           type: number
 *         Shelf_Name:
 *           type: string
 *         Category_ID:
 *           type: number
 *         Location:
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

// Define a validation schema for shelf data
const shelfValidationSchema = Joi.object({
  // Shelf ID validation
  // - Must be a number
  // - Required field
  Shelf_ID: Joi.number().required().messages({
    "number.base": "Shelf ID must be a number",
    "any.required": "Shelf ID is required",
  }),

  // Shelf Name validation
  // - Must be a string
  // - Maximum 100 characters
  // - Required field
  Shelf_Name: Joi.string().max(100).required().messages({
    "string.base": "Shelf Name must be a string",
    "string.max": "Shelf Name cannot exceed 100 characters",
    "any.required": "Shelf Name is required",
  }),

  // Category ID validation
  // - Must be a number
  // - Required field
  Category_ID: Joi.number().required().messages({
    "number.base": "Category ID must be a number",
    "any.required": "Category ID is required",
  }),

  // Location validation
  // - Must be a string
  // - Maximum 200 characters
  // - Required field
  Location: Joi.string().max(200).required().messages({
    "string.base": "Location must be a string",
    "string.max": "Location cannot exceed 200 characters",
    "any.required": "Location is required",
  }),
});

// Helper function to validate shelf data
// - Takes shelf data as input
// - Returns validation result with all errors (abortEarly: false)
// - Type 'any' is used for shelfData as it's raw input that needs validation
export const validateShelf = (shelfData: any) => {
  return shelfValidationSchema.validate(shelfData, { abortEarly: false });
};
