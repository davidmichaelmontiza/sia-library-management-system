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
exports.FineController = void 0;
const fineModel_1 = require("../models/fineModel");
const mongoose_1 = __importDefault(require("mongoose"));
const fineValidation_1 = require("../validations/fineValidation");
const bcrypt_1 = __importDefault(require("bcrypt"));
class FineController {
    // Create a new fine
    // Handles POST requests to create a new fine in the database
    createFine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate incoming fine data against schema rules
                const { error, value: payload } = (0, fineValidation_1.validateFine)(req.body);
                if (error) {
                    // Return early if validation fails, sending back specific error messages
                    res
                        .status(400)
                        .json({ message: error.details.map((err) => err.message) });
                    return;
                }
                // Generate a unique salt and hash the fine's password for security
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(payload.password, salt);
                // Prepare fine data with a new MongoDB ID and the hashed password
                const fineData = Object.assign(Object.assign({ _id: new mongoose_1.default.Types.ObjectId() }, payload), { password: hashedPassword });
                // Create and save the new fine to the database
                const fine = new fineModel_1.Fine(fineData);
                const savedFine = yield fine.save();
                // Return the newly created fine with 201 Created status
                res.status(201).json(savedFine);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Get all fines
    // Handles GET requests to retrieve all fines from the database
    getAllFines(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all fines from database, excluding sensitive password field
                const fines = yield fineModel_1.Fine.find().select("-password");
                res.json(fines);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Get fine by ID
    // Handles GET requests to retrieve a specific fine by its ID
    getFineById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempt to find fine by ID, excluding password field
                const fine = yield fineModel_1.Fine.findById(req.params.id).select("-password");
                // Return 404 if fine doesn't exist
                if (!fine) {
                    res.status(404).json({ message: "Fine not found" });
                    return;
                }
                // Return the found fine
                res.json(fine);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Update fine
    // Handles PUT/PATCH requests to update an existing fine
    updateFine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the updated fine data
                const { error, value: payload } = (0, fineValidation_1.validateFine)(req.body);
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
                const fineData = Object.assign(Object.assign({}, payload), { password: hashedPassword });
                // Update the fine and get the updated document
                const fine = yield fineModel_1.Fine.findByIdAndUpdate(req.params.id, fineData, { new: true } // This option returns the modified document rather than the original
                );
                // Return 404 if fine doesn't exist
                if (!fine) {
                    res.status(404).json({ message: "Fine not found" });
                    return;
                }
                // Remove password from response data for security
                let withoutPassword = fine.toJSON();
                delete withoutPassword.password;
                // Return the updated fine without password
                res.json(withoutPassword);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Delete fine
    // Handles DELETE requests to remove a fine from the database
    deleteFine(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempt to find and delete the fine in one operation
                const fine = yield fineModel_1.Fine.findByIdAndDelete(req.params.id);
                // Return 404 if fine doesn't exist
                if (!fine) {
                    res.status(404).json({ message: "Fine not found" });
                    return;
                }
                // Confirm successful deletion
                res.json({ message: "Fine deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.FineController = FineController;
