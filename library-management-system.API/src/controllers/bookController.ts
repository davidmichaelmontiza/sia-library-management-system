import { Request, Response } from "express";
import { Book } from "../models/bookModel";
import { IBook } from "../interfaces/bookInterface";
import mongoose from "mongoose";
import { validateBook } from "../validations/bookValidation";

export class BookController {
  // Create a new book
  // Handles POST requests to create a new book in the database
  public async createBook(req: Request, res: Response): Promise<void> {
    try {
      // Validate incoming book data against schema rules
      const { error, value: payload } = validateBook(req.body);
      if (error) {
        // Return early if validation fails, sending back specific error messages
        res
          .status(400)
          .json({ message: error.details.map((err) => err.message) });
        return;
      }

      // Prepare book data with a new MongoDB ID and the hashed password
      const bookData: IBook = {
        _id: new mongoose.Types.ObjectId(),
        ...payload,
      };

      // Create and save the new book to the database
      const book = new Book(bookData);
      const savedBook = await book.save();

      // Return the newly created book with 201 Created status
      res.status(201).json(savedBook);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all books
  // Handles GET requests to retrieve all books from the database
  public async getAllBooks(req: Request, res: Response): Promise<void> {
    try {
      // Fetch all books from database, excluding sensitive password field
      const books: IBook[] = await Book.find().select("-password");
      res.json(books);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get book by ID
  // Handles GET requests to retrieve a specific book by its ID
  public async getBookById(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to find book by ID, excluding password field
      const book: IBook | null = await Book.findById(req.params.id).select(
        "-password"
      );

      // Return 404 if book doesn't exist
      if (!book) {
        res.status(404).json({ message: "Book not found" });
        return;
      }

      // Return the found book
      res.json(book);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update book
  // Handles PUT/PATCH requests to update an existing book
  public async updateBook(req: Request, res: Response): Promise<void> {
    try {
      // Validate the updated book data
      const { error, value: payload } = validateBook(req.body);
      if (error) {
        res
          .status(400)
          .json({ message: error.details.map((err) => err.message) });
        return;
      }
      
      // Prepare update data with hashed password
      const bookData: Partial<IBook> = {
        ...payload,
      };

      // Update the book and get the updated document
      const book: IBook | null = await Book.findByIdAndUpdate(
        req.params.id,
        bookData,
        { new: true } // This option returns the modified document rather than the original
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
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete book
  // Handles DELETE requests to remove a book from the database
  public async deleteBook(req: Request, res: Response): Promise<void> {
    try {
      // Attempt to find and delete the book in one operation
      const book: IBook | null = await Book.findByIdAndDelete(req.params.id);

      // Return 404 if book doesn't exist
      if (!book) {
        res.status(404).json({ message: "Book not found" });
        return;
      }

      // Confirm successful deletion
      res.json({ message: "Book deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
