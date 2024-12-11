import { Request, Response } from "express";
import { Shelf } from "../models/shelfModel";
import { IShelf } from "../interfaces/shelfInterface";
import mongoose from "mongoose";
import { validateShelf } from "../validations/shelfValidation";


export class ShelfController {
  // Create a new shelf
  // Handles POST requests to create a new shelf in the database
  public async createShelf(req: Request, res: Response): Promise<void> {
    try {
      // Validate incoming shelf data against schema rules
      const { error, value: payload } = validateShelf(req.body);
      if (error) {
        // Return early if validation fails, sending back specific error messages
        res
          .status(400)
          .json({ message: error.details.map((err) => err.message) });
        return;
      }

      // Prepare shelf data with a new MongoDB ID and the hashed password
      const shelfData: IShelf = {
        _id: new mongoose.Types.ObjectId(),
        ...payload,
      };

      // Create and save the new shelf to the database
      const shelf = new Shelf(shelfData);
      const savedShelf = await shelf.save();

      // Return the newly created shelf with 201 Created status
      res.status(201).json(savedShelf);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all shelves
  // Handles GET requests to retrieve all shelves from the database
  public async getAllShelves(req: Request, res: Response): Promise<void> {
    try {
      // Fetch all shelves from database, excluding sensitive password field
      const shelves: IShelf[] = await Shelf.find().select("-password");
      res.json(shelves);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get shelf by ID
  // Handles GET requests to retrieve a specific shelf by their ID
  public async getShelfById(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to find shelf by ID, excluding password field
      const shelf: IShelf | null = await Shelf.findById(req.params.id).select(
        "-password"
      );

      // Return 404 if shelf doesn't exist
      if (!shelf) {
        res.status(404).json({ message: "Shelf not found" });
        return;
      }

      // Return the found shelf
      res.json(shelf);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update shelf
  // Handles PUT/PATCH requests to update an existing shelf
  public async updateShelf(req: Request, res: Response): Promise<void> {
    try {
      // Validate the updated shelf data
      const { error, value: payload } = validateShelf(req.body);
      if (error) {
        res
          .status(400)
          .json({ message: error.details.map((err) => err.message) });
        return;
      }

      // Prepare update data with hashed password
      const shelfData: Partial<IShelf> = { ...payload, };

      // Update the shelf and get the updated document
      const shelf: IShelf | null = await Shelf.findByIdAndUpdate(
        req.params.id,
        shelfData,
        { new: true } // This option returns the modified document rather than the original
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
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete shelf
  // Handles DELETE requests to remove a shelf from the database
  public async deleteShelf(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to find and delete the shelf in one operation
      const shelf: IShelf | null = await Shelf.findByIdAndDelete(req.params.id);

      // Return 404 if shelf doesn't exist
      if (!shelf) {
        res.status(404).json({ message: "Shelf not found" });
        return;
      }

      // Confirm successful deletion
      res.json({ message: "Shelf deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
