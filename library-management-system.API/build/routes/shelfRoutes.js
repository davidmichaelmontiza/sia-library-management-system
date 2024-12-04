"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shelfController_1 = require("../controllers/shelfController");
const authMiddleware_1 = require("../middleware/authMiddleware");
// Initialize express Router
const router = express_1.default.Router();
// Create instance of ShelfController to handle route logic
const shelfController = new shelfController_1.ShelfController();
/**
 * @swagger
 * tags:
 *   name: Shelf
 *   description: Shelf endpoints
 */
/**
 * @swagger
 * /api/shelves:
 *   post:
 *     summary: Create a new shelf
 *     tags: [Shelves]
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Shelf already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Shelf already exists
 *
 *   get:
 *     summary: Get all shelves
 *     tags: [Shelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
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
 *         description: List of shelves
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
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 */
/**
 * @swagger
 * /api/shelves/{id}:
 *   get:
 *     summary: Get shelf by ID
 *     tags: [Shelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shelf ID
 *     responses:
 *       200:
 *         description: Shelf details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShelfResponse'
 *       404:
 *         description: Shelf not found
 *
 *   put:
 *     summary: Update shelf
 *     tags: [Shelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shelf ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shelf updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShelfResponse'
 *       404:
 *         description: Shelf not found
 *
 *   delete:
 *     summary: Delete shelf
 *     tags: [Shelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shelf ID
 *     responses:
 *       204:
 *         description: Shelf deleted successfully
 *       404:
 *         description: Shelf not found
 */
/**
 * @swagger
 * /api/shelves/profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get shelf profile
 *     tags: [Shelves]
 *     responses:
 *       200:
 *         description: Shelf profile retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
// Shelf Routes:
// POST /api/shelves
// Creates a new shelf
// Request body should contain shelf details (name, description)
router.post("/", authMiddleware_1.authMiddleware, shelfController.createShelf);
// GET /api/shelves
// Retrieves all shelves from the database
// Returns array of shelves
router.get("/", authMiddleware_1.authMiddleware, shelfController.getAllShelves);
// GET /api/shelves/:id
// Retrieves a specific shelf by its ID
// :id - MongoDB ObjectId of the shelf
router.get("/:id", authMiddleware_1.authMiddleware, shelfController.getShelfById);
// PUT /api/shelves/:id
// Updates an existing shelf's information
// :id - MongoDB ObjectId of the shelf to update
// Request body should contain updated shelf details
router.put("/:id", authMiddleware_1.authMiddleware, shelfController.updateShelf);
// DELETE /api/shelves/:id
// Removes a shelf from the database
// :id - MongoDB ObjectId of the shelf to delete
router.delete("/:id", authMiddleware_1.authMiddleware, shelfController.deleteShelf);
// Export the router for use in main application
exports.default = router;
