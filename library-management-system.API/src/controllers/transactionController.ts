import { Request, Response } from "express";
import { Transaction } from "../models/transactionModel";
import { ITransaction } from "../interfaces/transactionInterface";
import mongoose from "mongoose";
import { validateTransaction } from "../validations/transactionValidation";

export class TransactionController {
  // Create a new transaction
  // Handles POST requests to create a new transaction in the database
  public async createTransaction(req: Request, res: Response): Promise<void> {
    try {
      // Validate incoming transaction data against schema rules
      const { error, value: payload } = validateTransaction(req.body);
      if (error) {
        // Return early if validation fails, sending back specific error messages
        res
          .status(400)
          .json({ message: error.details.map((err) => err.message) });
        return;
      }
      // Prepare transaction data with a new MongoDB ID and the hashed password
      const transactionData: ITransaction = {
        _id: new mongoose.Types.ObjectId(),
        ...payload,
      };

      // Create and save the new transaction to the database
      const transaction = new Transaction(transactionData);
      const savedTransaction = await transaction.save();

      // Return the newly created transaction with 201 Created status
      res.status(201).json(savedTransaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all transactions
  // Handles GET requests to retrieve all transactions from the database
  public async getAllTransactions(req: Request, res: Response): Promise<void> {
    try {
      // Fetch all transactions from database, excluding sensitive password field
      const transactions: ITransaction[] = await Transaction.find().select("-password");
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get transaction by ID
  // Handles GET requests to retrieve a specific transaction by their ID
  public async getTransactionById(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to find transaction by ID, excluding password field
      const transaction: ITransaction | null = await Transaction.findById(req.params.id).select(
        "-password"
      );

      // Return 404 if transaction doesn't exist
      if (!transaction) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }

      // Return the found transaction
      res.json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update transaction
  // Handles PUT/PATCH requests to update an existing transaction
  public async updateTransaction(req: Request, res: Response): Promise<void> {
    try {
      // Validate the updated transaction data
      const { error, value: payload } = validateTransaction(req.body);
      if (error) {
        res
          .status(400)
          .json({ message: error.details.map((err) => err.message) });
        return;
      }

      // Prepare update data with hashed password
      const transactionData: Partial<ITransaction> = { ...payload, };

      // Update the transaction and get the updated document
      const transaction: ITransaction | null = await Transaction.findByIdAndUpdate(
        req.params.id,
        transactionData,
        { new: true } // This option returns the modified document rather than the original
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
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete transaction
  // Handles DELETE requests to remove a transaction from the database
  public async deleteTransaction(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to find and delete the transaction in one operation
      const transaction: ITransaction | null = await Transaction.findByIdAndDelete(req.params.id);

      // Return 404 if transaction doesn't exist
      if (!transaction) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }

      // Confirm successful deletion
      res.json({ message: "Transaction deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
