import { Request, Response } from "express";
import { Librarian } from "../models/librarianModel";
import { ILibrarian } from "../interfaces/librarianInterface";
import mongoose from "mongoose";
import { validateLibrarian } from "../validations/librarianValidation";
import bcrypt from "bcrypt";

export class LibrarianController {
  // Create a new librarian
  // Handles POST requests to create a new librarian in the database
  public async createLibrarian(req: Request, res: Response): Promise<void> {
    try {
      // Validate incoming librarian data against schema rules
      const { error, value: payload } = validateLibrarian(req.body);
      if (error) {
        // Return early if validation fails, sending back specific error messages
        res
          .status(400)
          .json({ message: error.details.map((err) => err.message) });
        return;
      }

      // Prepare librarian data with a new MongoDB ID and the hashed password
      const librarianData: ILibrarian = {
        _id: new mongoose.Types.ObjectId(),
        ...payload,
      };

      // Create and save the new librarian to the database
      const librarian = new Librarian(librarianData);
      const savedLibrarian = await librarian.save();

      // Return the newly created librarian with 201 Created status
      res.status(201).json(savedLibrarian);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all librarians
  // Handles GET requests to retrieve all librarians from the database
  public async getAllLibrarians(req: Request, res: Response): Promise<void> {
    try {
      // Fetch all librarians from database, excluding sensitive password field
      const librarians: ILibrarian[] = await Librarian.find().select("-password");
      res.json(librarians);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get librarian by ID
  // Handles GET requests to retrieve a specific librarian by their ID
  public async getLibrarianById(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to find librarian by ID, excluding password field
      const librarian: ILibrarian | null = await Librarian.findById(req.params.id).select(
        "-password"
      );

      // Return 404 if librarian doesn't exist
      if (!librarian) {
        res.status(404).json({ message: "Librarian not found" });
        return;
      }

      // Return the found librarian
      res.json(librarian);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update librarian
  // Handles PUT/PATCH requests to update an existing librarian
  public async updateLibrarian(req: Request, res: Response): Promise<void> {
    try {
      // Validate the updated librarian data
      const { error, value: payload } = validateLibrarian(req.body);
      if (error) {
        res
          .status(400)
          .json({ message: error.details.map((err) => err.message) });
        return;
      }

      // Prepare update data with hashed password
      const librarianData: Partial<ILibrarian> = {
        ...payload,
      };

      // Update the librarian and get the updated document
      const librarian: ILibrarian | null = await Librarian.findByIdAndUpdate(
        req.params.id,
        librarianData,
        { new: true } // This option returns the modified document rather than the original
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
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete librarian
  // Handles DELETE requests to remove a librarian from the database
  public async deleteLibrarian(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to find and delete the librarian in one operation
      const librarian: ILibrarian | null = await Librarian.findByIdAndDelete(req.params.id);

      // Return 404 if librarian doesn't exist
      if (!librarian) {
        res.status(404).json({ message: "Librarian not found" });
        return;
      }

      // Confirm successful deletion
      res.json({ message: "Librarian deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
