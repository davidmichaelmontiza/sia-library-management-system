import Joi from "joi"; // Import Joi validation library

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
