"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fineController_1 = require("../controllers/fineController");
const authMiddleware_1 = require("../middleware/authMiddleware");
// Initialize express Router
const router = express_1.default.Router();
// Create instance of FineController to handle route logic
const fineController = new fineController_1.FineController();
/**
 * @swagger
 * tags:
 *   name: Fine
 *   description: Fine endpoints
 */
/**
 * @swagger
 * /api/fines:
 *   post:
 *     summary: Create a new fine
 *     tags: [Fines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fine'
 *     responses:
 *       201:
 *         description: Fine created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FineResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Fine already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fine already exists
 *
 *   get:
 *     summary: Get all fines
 *     tags: [Fines]
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
 *         description: List of fines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FineResponse'
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
 * /api/fines/{id}:
 *   get:
 *     summary: Get fine by ID
 *     tags: [Fines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Fine ID
 *     responses:
 *       200:
 *         description: Fine details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FineResponse'
 *       404:
 *         description: Fine not found
 *
 *   put:
 *     summary: Update fine
 *     tags: [Fines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Fine ID
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
 *         description: Fine updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FineResponse'
 *       404:
 *         description: Fine not found
 *
 *   delete:
 *     summary: Delete fine
 *     tags: [Fines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Fine ID
 *     responses:
 *       204:
 *         description: Fine deleted successfully
 *       404:
 *         description: Fine not found
 */
/**
 * @swagger
 * /api/fines/profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get fine profile
 *     tags: [Fines]
 *     responses:
 *       200:
 *         description: Fine profile retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
// Fine Routes:
// POST /api/fines
// Creates a new fine
// Request body should contain fine details (name, description)
router.post("/", authMiddleware_1.authMiddleware, fineController.createFine);
// GET /api/fines
// Retrieves all fines from the database
// Returns array of fines
router.get("/", authMiddleware_1.authMiddleware, fineController.getAllFines);
// GET /api/fines/:id
// Retrieves a specific fine by its ID
// :id - MongoDB ObjectId of the fine
router.get("/:id", authMiddleware_1.authMiddleware, fineController.getFineById);
// PUT /api/fines/:id
// Updates an existing fine's information
// :id - MongoDB ObjectId of the fine to update
// Request body should contain updated fine details
router.put("/:id", authMiddleware_1.authMiddleware, fineController.updateFine);
// DELETE /api/fines/:id
// Removes a fine from the database
// :id - MongoDB ObjectId of the fine to delete
router.delete("/:id", authMiddleware_1.authMiddleware, fineController.deleteFine);
// Export the router for use in main application
exports.default = router;
