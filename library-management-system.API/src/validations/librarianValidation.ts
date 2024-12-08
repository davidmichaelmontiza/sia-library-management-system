import Joi from "joi"; // Import Joi validation library

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
