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
exports.BookController = void 0;
const bookModel_1 = require("../models/bookModel");
const mongoose_1 = __importDefault(require("mongoose"));
const bookValidation_1 = require("../validations/bookValidation");
const bcrypt_1 = __importDefault(require("bcrypt"));
class BookController {
    // Create a new book
    // Handles POST requests to create a new book in the database
    createBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate incoming book data against schema rules
                const { error, value: payload } = (0, bookValidation_1.validateBook)(req.body);
                if (error) {
                    // Return early if validation fails, sending back specific error messages
                    res
                        .status(400)
                        .json({ message: error.details.map((err) => err.message) });
                    return;
                }
                // Generate a unique salt and hash the book's password for security
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(payload.password, salt);
                // Prepare book data with a new MongoDB ID and the hashed password
                const bookData = Object.assign(Object.assign({ _id: new mongoose_1.default.Types.ObjectId() }, payload), { password: hashedPassword });
                // Create and save the new book to the database
                const book = new bookModel_1.Book(bookData);
                const savedBook = yield book.save();
                // Return the newly created book with 201 Created status
                res.status(201).json(savedBook);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Get all books
    // Handles GET requests to retrieve all books from the database
    getAllBooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all books from database, excluding sensitive password field
                const books = yield bookModel_1.Book.find().select("-password");
                res.json(books);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Get book by ID
    // Handles GET requests to retrieve a specific book by its ID
    getBookById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempt to find book by ID, excluding password field
                const book = yield bookModel_1.Book.findById(req.params.id).select("-password");
                // Return 404 if book doesn't exist
                if (!book) {
                    res.status(404).json({ message: "Book not found" });
                    return;
                }
                // Return the found book
                res.json(book);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Update book
    // Handles PUT/PATCH requests to update an existing book
    updateBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the updated book data
                const { error, value: payload } = (0, bookValidation_1.validateBook)(req.body);
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
                const bookData = Object.assign(Object.assign({}, payload), { password: hashedPassword });
                // Update the book and get the updated document
                const book = yield bookModel_1.Book.findByIdAndUpdate(req.params.id, bookData, { new: true } // This option returns the modified document rather than the original
                );
                // Return 404 if book doesn't exist
                if (!book) {
                    res.status(404).json({ message: "Book not found" });
                    return;
                }
                // Remove password from response data for security
                let withoutPassword = book.toJSON();
                delete withoutPassword.password;
                // Return the updated book without password
                res.json(withoutPassword);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Delete book
    // Handles DELETE requests to remove a book from the database
    deleteBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempt to find and delete the book in one operation
                const book = yield bookModel_1.Book.findByIdAndDelete(req.params.id);
                // Return 404 if book doesn't exist
                if (!book) {
                    res.status(404).json({ message: "Book not found" });
                    return;
                }
                // Confirm successful deletion
                res.json({ message: "Book deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.BookController = BookController;
