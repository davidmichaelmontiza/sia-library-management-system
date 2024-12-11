import { Request, Response } from "express";
import { Fine } from "../models/fineModel";
import { IFine } from "../interfaces/fineInterface";
import mongoose from "mongoose";
import { validateFine } from "../validations/fineValidation";
import bcrypt from "bcrypt";

export class FineController {
  // Create a new fine
  // Handles POST requests to create a new fine in the database
  public async createFine(req: Request, res: Response): Promise<void> {
    try {
      // Validate incoming fine data against schema rules
      const { error, value: payload } = validateFine(req.body);
      if (error) {
        // Return early if validation fails, sending back specific error messages
        res
          .status(400)
          .json({ message: error.details.map((err) => err.message) });
        return;
      }
      // Prepare fine data with a new MongoDB ID and the hashed password
      const fineData: IFine = {
        _id: new mongoose.Types.ObjectId(),
        ...payload,
      };

      // Create and save the new fine to the database
      const fine = new Fine(fineData);
      const savedFine = await fine.save();

      // Return the newly created fine with 201 Created status
      res.status(201).json(savedFine);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all fines
  // Handles GET requests to retrieve all fines from the database
  public async getAllFines(req: Request, res: Response): Promise<void> {
    try {
      // Fetch all fines from database, excluding sensitive password field
      const fines: IFine[] = await Fine.find().select("-password");
      res.json(fines);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get fine by ID
  // Handles GET requests to retrieve a specific fine by its ID
  public async getFineById(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to find fine by ID, excluding password field
      const fine: IFine | null = await Fine.findById(req.params.id).select(
        "-password"
      );

      // Return 404 if fine doesn't exist
      if (!fine) {
        res.status(404).json({ message: "Fine not found" });
        return;
      }

      // Return the found fine
      res.json(fine);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update fine
  // Handles PUT/PATCH requests to update an existing fine
  public async updateFine(req: Request, res: Response): Promise<void> {
    try {
      // Validate the updated fine data
      const { error, value: payload } = validateFine(req.body);
      if (error) {
        res
          .status(400)
          .json({ message: error.details.map((err) => err.message) });
        return;
      }

      // Prepare update data with hashed password
      const fineData: Partial<IFine> = { ...payload, };

      // Update the fine and get the updated document
      const fine: IFine | null = await Fine.findByIdAndUpdate(
        req.params.id,
        fineData,
        { new: true } // This option returns the modified document rather than the original
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
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete fine
  // Handles DELETE requests to remove a fine from the database
  public async deleteFine(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to find and delete the fine in one operation
      const fine: IFine | null = await Fine.findByIdAndDelete(req.params.id);

      // Return 404 if fine doesn't exist
      if (!fine) {
        res.status(404).json({ message: "Fine not found" });
        return;
      }

      // Confirm successful deletion
      res.json({ message: "Fine deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
