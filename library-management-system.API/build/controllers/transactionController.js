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
exports.TransactionController = void 0;
const transactionModel_1 = require("../models/transactionModel");
const mongoose_1 = __importDefault(require("mongoose"));
const transactionValidation_1 = require("../validations/transactionValidation");
const bcrypt_1 = __importDefault(require("bcrypt"));
class TransactionController {
    // Create a new transaction
    // Handles POST requests to create a new transaction in the database
    createTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate incoming transaction data against schema rules
                const { error, value: payload } = (0, transactionValidation_1.validateTransaction)(req.body);
                if (error) {
                    // Return early if validation fails, sending back specific error messages
                    res
                        .status(400)
                        .json({ message: error.details.map((err) => err.message) });
                    return;
                }
                // Generate a unique salt and hash the transaction's password for security
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(payload.password, salt);
                // Prepare transaction data with a new MongoDB ID and the hashed password
                const transactionData = Object.assign(Object.assign({ _id: new mongoose_1.default.Types.ObjectId() }, payload), { password: hashedPassword });
                // Create and save the new transaction to the database
                const transaction = new transactionModel_1.Transaction(transactionData);
                const savedTransaction = yield transaction.save();
                // Return the newly created transaction with 201 Created status
                res.status(201).json(savedTransaction);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Get all transactions
    // Handles GET requests to retrieve all transactions from the database
    getAllTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all transactions from database, excluding sensitive password field
                const transactions = yield transactionModel_1.Transaction.find().select("-password");
                res.json(transactions);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Get transaction by ID
    // Handles GET requests to retrieve a specific transaction by their ID
    getTransactionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempt to find transaction by ID, excluding password field
                const transaction = yield transactionModel_1.Transaction.findById(req.params.id).select("-password");
                // Return 404 if transaction doesn't exist
                if (!transaction) {
                    res.status(404).json({ message: "Transaction not found" });
                    return;
                }
                // Return the found transaction
                res.json(transaction);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Update transaction
    // Handles PUT/PATCH requests to update an existing transaction
    updateTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the updated transaction data
                const { error, value: payload } = (0, transactionValidation_1.validateTransaction)(req.body);
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
                const transactionData = Object.assign(Object.assign({}, payload), { password: hashedPassword });
                // Update the transaction and get the updated document
                const transaction = yield transactionModel_1.Transaction.findByIdAndUpdate(req.params.id, transactionData, { new: true } // This option returns the modified document rather than the original
                );
                // Return 404 if transaction doesn't exist
                if (!transaction) {
                    res.status(404).json({ message: "Transaction not found" });
                    return;
                }
                // Remove password from response data for security
                let withoutPassword = transaction.toJSON();
                delete withoutPassword.password;
                // Return the updated transaction without password
                res.json(withoutPassword);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    // Delete transaction
    // Handles DELETE requests to remove a transaction from the database
    deleteTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Attempt to find and delete the transaction in one operation
                const transaction = yield transactionModel_1.Transaction.findByIdAndDelete(req.params.id);
                // Return 404 if transaction doesn't exist
                if (!transaction) {
                    res.status(404).json({ message: "Transaction not found" });
                    return;
                }
                // Confirm successful deletion
                res.json({ message: "Transaction deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.TransactionController = TransactionController;
