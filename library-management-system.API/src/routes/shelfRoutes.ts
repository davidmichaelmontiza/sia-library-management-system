import express from "express";
import { ShelfController } from "../controllers/shelfController";
import { authMiddleware } from "../middleware/authMiddleware";

// Initialize express Router
const router = express.Router();

// Create an instance of ShelfController to handle route logic
const shelfController = new ShelfController();

/**
 * @swagger
 * tags:
 *   - name: Shelf
 *     description: Shelf management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Shelf:
 *       type: object
 *       properties:
 *         Shelf_ID:
 *           type: number
 *           example: 101
 *         Shelf_Name:
 *           type: string
 *           example: "Fiction Shelf"
 *         Category_ID:
 *           type: number
 *           example: 5
 *         Location:
 *           type: string
 *           example: "Second Floor, Section B"
 *       required:
 *         - Shelf_ID
 *         - Shelf_Name
 *         - Category_ID
 *         - Location
 *     ShelfResponse:
 *       type: object
 *       properties:
 *         Shelf_ID:
 *           type: number
 *         Shelf_Name:
 *           type: string
 *         Category_ID:
 *           type: number
 *         Location:
 *           type: string
 *     UpdateShelfRequest:
 *       type: object
 *       properties:
 *         Shelf_Name:
 *           type: string
 *         Category_ID:
 *           type: number
 *         Location:
 *           type: string
 *     Pagination:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *           example: 1
 *         totalPages:
 *           type: integer
 *           example: 5
 *         totalItems:
 *           type: integer
 *           example: 50
 */

/**
 * @swagger
 * /api/Shelf:
 *   post:
 *     summary: Create a new shelf
 *     tags: [Shelf]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shelf'
 *     responses:
 *       201:
 *         description: Shelf created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShelfResponse'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Shelf already exists
 *
 *   get:
 *     summary: Retrieve a list of shelves
 *     tags: [Shelf]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of shelves with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShelfResponse'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /api/Shelf/{id}:
 *   get:
 *     summary: Retrieve shelf details by ID
 *     tags: [Shelf]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Shelf ID
 *     responses:
 *       200:
 *         description: Shelf details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShelfResponse'
 *       404:
 *         description: Shelf not found
 *
 *   put:
 *     summary: Update a shelf by ID
 *     tags: [Shelf]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Shelf ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShelfRequest'
 *     responses:
 *       200:
 *         description: Shelf updated successfully
 *       404:
 *         description: Shelf not found
 *
 *   delete:
 *     summary: Delete a shelf by ID
 *     tags: [Shelf]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Shelf ID
 *     responses:
 *       204:
 *         description: Shelf deleted successfully
 *       404:
 *         description: Shelf not found
 */


// Shelf Routes

// POST /api/shelves - Create a new shelf
router.post("/api/shelf", authMiddleware, shelfController.createShelf);

// GET /api/shelves - Retrieve all shelves
router.get("/api/shelf", authMiddleware, shelfController.getAllShelves);

// GET /api/shelves/:id - Retrieve a specific shelf by ID
router.get("/api/shelf/:id", authMiddleware, shelfController.getShelfById);

// PUT /api/shelves/:id - Update a specific shelf by ID
router.put("/api/shelf/:id", authMiddleware, shelfController.updateShelf);

// DELETE /api/shelves/:id - Delete a specific shelf by ID
router.delete("/api/shelf/:id", authMiddleware, shelfController.deleteShelf);


export default router;
