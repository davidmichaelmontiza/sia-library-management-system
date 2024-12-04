import Joi from "joi"; // Import Joi validation library

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
