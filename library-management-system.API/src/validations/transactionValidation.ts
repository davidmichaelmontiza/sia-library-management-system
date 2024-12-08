import Joi from "joi"; // Import Joi validation library

// Define a validation schema for transaction data
const transactionValidationSchema = Joi.object({
  // Transaction ID validation
  // - Must be a number
  Transaction_ID: Joi.number().required().messages({
    "any.required": "Transaction ID is required",
    "number.base": "Transaction ID must be a number",
  }),

  // Student ID validation
  // - Must be a number
  Student_ID: Joi.number().required().messages({
    "any.required": "Student ID is required",
    "number.base": "Student ID must be a number",
  }),

  // Book ID validation
  // - Must be a number
  Book_ID: Joi.number().required().messages({
    "any.required": "Book ID is required",
    "number.base": "Book ID must be a number",
  }),

  // Faculty ID validation
  // - Must be a number
  Faculty_ID: Joi.number().required().messages({
    "any.required": "Faculty ID is required",
    "number.base": "Faculty ID must be a number",
  }),

  // Borrow Date validation
  // - Must be a valid date
  Borrow_Date: Joi.date().required().messages({
    "any.required": "Borrow date is required",
    "date.base": "Borrow date must be a valid date",
  }),

  // Return Date validation
  // - Must be a valid date
  Return_Date: Joi.date().required().messages({
    "any.required": "Return date is required",
    "date.base": "Return date must be a valid date",
  }),

  // Fine validation
  // - Must be a number
  Fine: Joi.number().min(0).required().messages({
    "any.required": "Fine is required",
    "number.base": "Fine must be a number",
    "number.min": "Fine must be greater than or equal to 0",
  }),
});

// Helper function to validate transaction data
// - Takes transaction data as input
// - Returns validation result with all errors (abortEarly: false)
// - Type 'any' is used for transactionData as it's raw input that needs validation
export const validateTransaction = (transactionData: any) => {
  return transactionValidationSchema.validate(transactionData, { abortEarly: false });
};
