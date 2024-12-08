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
exports.LibrarianController = void 0;
const librarianModel_1 = require("../models/librarianModel");
const mongoose_1 = __importDefault(require("mongoose"));
const librarianValidation_1 = require("../validations/librarianValidation");
const bcrypt_1 = __importDefault(require("bcrypt"));
class LibrarianController {
    // Create a new librarian
    // Handles POST requests to create a new librarian in the database
    createLibrarian(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate incoming librarian data against schema rules
                const { error, value: payload } = (0, librarianValidation_1.validateLibrarian)(req.body);
                if (error) {
                    // Return early if validation fails, sending back specific error messages
                    res
                        .status(400)
                        .json({ message: error.details.map((err) => err.message) });
                    return;
                }
                // Generate a unique salt and hash the librarian's password for security
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(payload.password, salt);
                // Prepare librarian data with a new MongoDB ID and the hashed password
                const librarianData = Object.assign(Object.assign({ _id: new mongoose_1.default.Types.ObjectId() }, payload), { password: hashedPassword });
                // Create and save the new librarian to the database
                const librarian = new librarianModel_1.Librarian(librarianData);
                const savedLibrarian = yield librarian.save();
                // Return the newly created librarian with 201 Created status
                res.status(201).json(savedLibrarian);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Get all librarians
    // Handles GET requests to retrieve all librarians from the database
    getAllLibrarians(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all librarians from database, excluding sensitive password field
                const librarians = yield librarianModel_1.Librarian.find().select("-password");
                res.json(librarians);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Get librarian by ID
    // Handles GET requests to retrieve a specific librarian by their ID
    getLibrarianById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempt to find librarian by ID, excluding password field
                const librarian = yield librarianModel_1.Librarian.findById(req.params.id).select("-password");
                // Return 404 if librarian doesn't exist
                if (!librarian) {
                    res.status(404).json({ message: "Librarian not found" });
                    return;
                }
                // Return the found librarian
                res.json(librarian);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Update librarian
    // Handles PUT/PATCH requests to update an existing librarian
    updateLibrarian(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the updated librarian data
                const { error, value: payload } = (0, librarianValidation_1.validateLibrarian)(req.body);
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
                const librarianData = Object.assign(Object.assign({}, payload), { password: hashedPassword });
                // Update the librarian and get the updated document
                const librarian = yield librarianModel_1.Librarian.findByIdAndUpdate(req.params.id, librarianData, { new: true } // This option returns the modified document rather than the original
                );
                // Return 404 if librarian doesn't exist
                if (!librarian) {
                    res.status(404).json({ message: "Librarian not found" });
                    return;
                }
                // Remove password from response data for security
                let withoutPassword = librarian.toJSON();
                delete withoutPassword.password;
                // Return the updated librarian without password
                res.json(withoutPassword);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Delete librarian
    // Handles DELETE requests to remove a librarian from the database
    deleteLibrarian(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempt to find and delete the librarian in one operation
                const librarian = yield librarianModel_1.Librarian.findByIdAndDelete(req.params.id);
                // Return 404 if librarian doesn't exist
                if (!librarian) {
                    res.status(404).json({ message: "Librarian not found" });
                    return;
                }
                // Confirm successful deletion
                res.json({ message: "Librarian deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.LibrarianController = LibrarianController;
