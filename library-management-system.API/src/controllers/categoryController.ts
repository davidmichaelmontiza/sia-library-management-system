import { Request, Response } from "express";
import { Category } from "../models/categoryModel";
import { ICategory } from "../interfaces/categoryInterface";
import mongoose from "mongoose";
import { validateCategory } from "../validations/categoryValidation";

export class CategoryController {
  // Create a new category
  // Handles POST requests to create a new category in the database
  public async createCategory(req: Request, res: Response): Promise<void> {
    try {
      // Validate incoming category data against schema rules
      const { error, value: payload } = validateCategory(req.body);
      if (error) {
        // Return early if validation fails, sending back specific error messages
        res
          .status(400)
          .json({ message: error.details.map((err) => err.message) });
        return;
      }

      // Prepare category data with a new MongoDB ID and the hashed password
      const categoryData: ICategory = {
        _id: new mongoose.Types.ObjectId(),
        ...payload,
      };

      // Create and save the new category to the database
      const category = new Category(categoryData);
      const savedCategory = await category.save();

      // Return the newly created category with 201 Created status
      res.status(201).json(savedCategory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all categories
  // Handles GET requests to retrieve all categories from the database
  public async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      // Fetch all categories from database, excluding sensitive password field
      const categories: ICategory[] = await Category.find().select("-password");
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get category by ID
  // Handles GET requests to retrieve a specific category by its ID
  public async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to find category by ID, excluding password field
      const category: ICategory | null = await Category.findById(
        req.params.id
      ).select("-password");

      // Return 404 if category doesn't exist
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }

      // Return the found category
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update category
  // Handles PUT/PATCH requests to update an existing category
  public async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      // Validate the updated category data
      const { error, value: payload } = validateCategory(req.body);
      if (error) {
        res
          .status(400)
          .json({ message: error.details.map((err) => err.message) });
        return;
      }

      // Prepare update data with hashed password
      const categoryData: Partial<ICategory> = {
        ...payload,
      };

      // Update the category and get the updated document
      const category: ICategory | null = await Category.findByIdAndUpdate(
        req.params.id,
        categoryData,
        { new: true } // This option returns the modified document rather than the original
      );

      // Return 404 if category doesn't exist
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }

      // Remove password from response data for security
      let withoutPassword = category.toJSON();
      delete withoutPassword.password;

      // Return the updated category without password
      res.json(withoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete category
  // Handles DELETE requests to remove a category from the database
  public async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to find and delete the category in one operation
      const category: ICategory | null = await Category.findByIdAndDelete(
        req.params.id
      );

      // Return 404 if category doesn't exist
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }

      // Confirm successful deletion
      res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
