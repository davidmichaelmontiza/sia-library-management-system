"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const librarianController_1 = require("../controllers/librarianController");
const authMiddleware_1 = require("../middleware/authMiddleware");
// Initialize express Router
const router = express_1.default.Router();
// Create instance of LibrarianController to handle route logic
const librarianController = new librarianController_1.LibrarianController();
/**
 * @swagger
 * tags:
 *   name: Librarian
 *   description: Librarian endpoints
 */
/**
 * @swagger
 * /api/librarians:
 *   post:
 *     summary: Create a new librarian
 *     tags: [Librarians]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Librarian'
 *     responses:
 *       201:
 *         description: Librarian created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LibrarianResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Librarian already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Librarian already exists
 *
 *   get:
 *     summary: Get all librarians
 *     tags: [Librarians]
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
 *         description: List of librarians
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LibrarianResponse'
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
 * /api/librarians/{id}:
 *   get:
 *     summary: Get librarian by ID
 *     tags: [Librarians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Librarian ID
 *     responses:
 *       200:
 *         description: Librarian details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LibrarianResponse'
 *       404:
 *         description: Librarian not found
 *
 *   put:
 *     summary: Update librarian
 *     tags: [Librarians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Librarian ID
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
 *         description: Librarian updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LibrarianResponse'
 *       404:
 *         description: Librarian not found
 *
 *   delete:
 *     summary: Delete librarian
 *     tags: [Librarians]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Librarian ID
 *     responses:
 *       204:
 *         description: Librarian deleted successfully
 *       404:
 *         description: Librarian not found
 */
/**
 * @swagger
 * /api/librarians/profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get librarian profile
 *     tags: [Librarians]
 *     responses:
 *       200:
 *         description: Librarian profile retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
// Librarian Routes:
// POST /api/librarians
// Creates a new librarian
// Request body should contain librarian details (name, description)
router.post("/", authMiddleware_1.authMiddleware, librarianController.createLibrarian);
// GET /api/librarians
// Retrieves all librarians from the database
// Returns array of librarians
router.get("/", authMiddleware_1.authMiddleware, librarianController.getAllLibrarians);
// GET /api/librarians/:id
// Retrieves a specific librarian by its ID
// :id - MongoDB ObjectId of the librarian
router.get("/:id", authMiddleware_1.authMiddleware, librarianController.getLibrarianById);
// PUT /api/librarians/:id
// Updates an existing librarian's information
// :id - MongoDB ObjectId of the librarian to update
// Request body should contain updated librarian details
router.put("/:id", authMiddleware_1.authMiddleware, librarianController.updateLibrarian);
// DELETE /api/librarians/:id
// Removes a librarian from the database
// :id - MongoDB ObjectId of the librarian to delete
router.delete("/:id", authMiddleware_1.authMiddleware, librarianController.deleteLibrarian);
// Export the router for use in main application
exports.default = router;
