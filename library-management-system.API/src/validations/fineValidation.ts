import Joi from "joi"; // Import Joi validation library

/**
 * @swagger
 * components:
 *   schemas:
 *     Fine:
 *       type: object
 *       required:
 *         - Fine_ID
 *         - Student_ID
 *         - Transaction_ID
 *         - Amount
 *         - Status
 *       properties:
 *         Fine_ID:
 *           type: number
 *           description: Unique identifier for the fine
 *           example: 101
 *         Student_ID:
 *           type: number
 *           description: Unique identifier for the student
 *           example: 202
 *         Transaction_ID:
 *           type: number
 *           description: Unique identifier for the transaction
 *           example: 303
 *         Amount:
 *           type: number
 *           description: Fine amount
 *           example: 50
 *         Status:
 *           type: string
 *           description: Status of the fine
 *           example: "Paid"
 *     FineResponse:
 *       type: object
 *       properties:
 *         Fine_ID:
 *           type: number
 *         Student_ID:
 *           type: number
 *         Transaction_ID:
 *           type: number
 *         Amount:
 *           type: number
 *         Status:
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


// Define a validation schema for fine data
const fineValidationSchema = Joi.object({
  // Fine ID validation
  // - Must be a number
  // - Required field
  Fine_ID: Joi.number().required().messages({
    "number.base": "Fine ID must be a number",
    "any.required": "Fine ID is required",
  }),

  // Student ID validation
  // - Must be a number
  // - Required field
  Student_ID: Joi.number().required().messages({
    "number.base": "Student ID must be a number",
    "any.required": "Student ID is required",
  }),

  // Transaction ID validation
  // - Must be a number
  // - Required field
  Transaction_ID: Joi.number().required().messages({
    "number.base": "Transaction ID must be a number",
    "any.required": "Transaction ID is required",
  }),

  // Amount validation
  // - Must be a number
  // - Minimum value: 0
  // - Required field
  Amount: Joi.number().min(0).required().messages({
    "number.base": "Amount must be a number",
    "number.min": "Amount cannot be less than 0",
    "any.required": "Amount is required",
  }),

  // Status validation
  // - Must be a string
  // - Maximum 20 characters
  // - Required field
  Status: Joi.string().max(20).required().messages({
    "string.base": "Status must be a string",
    "string.max": "Status cannot exceed 20 characters",
    "any.required": "Status is required",
  }),
});

// Helper function to validate fine data
// - Takes fine data as input
// - Returns validation result with all errors (abortEarly: false)
// - Type 'any' is used for fineData as it's raw input that needs validation
export const validateFine = (fineData: any) => {
  return fineValidationSchema.validate(fineData, { abortEarly: false });
};
