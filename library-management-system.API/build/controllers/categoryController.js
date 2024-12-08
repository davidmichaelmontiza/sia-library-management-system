"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const categoryModel_1 = require("../models/categoryModel");
const mongoose_1 = __importDefault(require("mongoose"));
const categoryValidation_1 = require("../validations/categoryValidation");
const bcrypt_1 = __importDefault(require("bcrypt"));
class CategoryController {
    // Create a new category
    // Handles POST requests to create a new category in the database
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate incoming category data against schema rules
                const { error, value: payload } = (0, categoryValidation_1.validateCategory)(req.body);
                if (error) {
                    // Return early if validation fails, sending back specific error messages
                    res
                        .status(400)
                        .json({ message: error.details.map((err) => err.message) });
                    return;
                }
                // Generate a unique salt and hash the category's password for security
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(payload.password, salt);
                // Prepare category data with a new MongoDB ID and the hashed password
                const categoryData = Object.assign(Object.assign({ _id: new mongoose_1.default.Types.ObjectId() }, payload), { password: hashedPassword });
                // Create and save the new category to the database
                const category = new categoryModel_1.Category(categoryData);
                const savedCategory = yield category.save();
                // Return the newly created category with 201 Created status
                res.status(201).json(savedCategory);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Get all categories
    // Handles GET requests to retrieve all categories from the database
    getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all categories from database, excluding sensitive password field
                const categories = yield categoryModel_1.Category.find().select("-password");
                res.json(categories);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Get category by ID
    // Handles GET requests to retrieve a specific category by its ID
    getCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempt to find category by ID, excluding password field
                const category = yield categoryModel_1.Category.findById(req.params.id).select("-password");
                // Return 404 if category doesn't exist
                if (!category) {
                    res.status(404).json({ message: "Category not found" });
                    return;
                }
                // Return the found category
                res.json(category);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Update category
    // Handles PUT/PATCH requests to update an existing category
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the updated category data
                const { error, value: payload } = (0, categoryValidation_1.validateCategory)(req.body);
                if (error) {
                    res
                        .status(400)
                        .json({ message: error.details.map((err) => err.message) });
                    return;
                }
                // Hash the new password if it's being updated
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(payload.password, salt);
                // Prepare update data with hashed password
                const categoryData = Object.assign(Object.assign({}, payload), { password: hashedPassword });
                // Update the category and get the updated document
                const category = yield categoryModel_1.Category.findByIdAndUpdate(req.params.id, categoryData, { new: true } // This option returns the modified document rather than the original
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
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Delete category
    // Handles DELETE requests to remove a category from the database
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempt to find and delete the category in one operation
                const category = yield categoryModel_1.Category.findByIdAndDelete(req.params.id);
                // Return 404 if category doesn't exist
                if (!category) {
                    res.status(404).json({ message: "Category not found" });
                    return;
                }
                // Confirm successful deletion
                res.json({ message: "Category deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.CategoryController = CategoryController;
