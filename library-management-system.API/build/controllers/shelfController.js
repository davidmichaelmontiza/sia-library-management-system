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
exports.ShelfController = void 0;
const shelfModel_1 = require("../models/shelfModel");
const mongoose_1 = __importDefault(require("mongoose"));
const shelfValidation_1 = require("../validations/shelfValidation");
const bcrypt_1 = __importDefault(require("bcrypt"));
class ShelfController {
    // Create a new shelf
    // Handles POST requests to create a new shelf in the database
    createShelf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate incoming shelf data against schema rules
                const { error, value: payload } = (0, shelfValidation_1.validateShelf)(req.body);
                if (error) {
                    // Return early if validation fails, sending back specific error messages
                    res
                        .status(400)
                        .json({ message: error.details.map((err) => err.message) });
                    return;
                }
                // Generate a unique salt and hash the shelf's password for security
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(payload.password, salt);
                // Prepare shelf data with a new MongoDB ID and the hashed password
                const shelfData = Object.assign(Object.assign({ _id: new mongoose_1.default.Types.ObjectId() }, payload), { password: hashedPassword });
                // Create and save the new shelf to the database
                const shelf = new shelfModel_1.Shelf(shelfData);
                const savedShelf = yield shelf.save();
                // Return the newly created shelf with 201 Created status
                res.status(201).json(savedShelf);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Get all shelves
    // Handles GET requests to retrieve all shelves from the database
    getAllShelves(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all shelves from database, excluding sensitive password field
                const shelves = yield shelfModel_1.Shelf.find().select("-password");
                res.json(shelves);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Get shelf by ID
    // Handles GET requests to retrieve a specific shelf by their ID
    getShelfById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempt to find shelf by ID, excluding password field
                const shelf = yield shelfModel_1.Shelf.findById(req.params.id).select("-password");
                // Return 404 if shelf doesn't exist
                if (!shelf) {
                    res.status(404).json({ message: "Shelf not found" });
                    return;
                }
                // Return the found shelf
                res.json(shelf);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Update shelf
    // Handles PUT/PATCH requests to update an existing shelf
    updateShelf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the updated shelf data
                const { error, value: payload } = (0, shelfValidation_1.validateShelf)(req.body);
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
                const shelfData = Object.assign(Object.assign({}, payload), { password: hashedPassword });
                // Update the shelf and get the updated document
                const shelf = yield shelfModel_1.Shelf.findByIdAndUpdate(req.params.id, shelfData, { new: true } // This option returns the modified document rather than the original
                );
                // Return 404 if shelf doesn't exist
                if (!shelf) {
                    res.status(404).json({ message: "Shelf not found" });
                    return;
                }
                // Remove password from response data for security
                let withoutPassword = shelf.toJSON();
                delete withoutPassword.password;
                // Return the updated shelf without password
                res.json(withoutPassword);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Delete shelf
    // Handles DELETE requests to remove a shelf from the database
    deleteShelf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempt to find and delete the shelf in one operation
                const shelf = yield shelfModel_1.Shelf.findByIdAndDelete(req.params.id);
                // Return 404 if shelf doesn't exist
                if (!shelf) {
                    res.status(404).json({ message: "Shelf not found" });
                    return;
                }
                // Confirm successful deletion
                res.json({ message: "Shelf deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.ShelfController = ShelfController;
