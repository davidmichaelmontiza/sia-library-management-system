import express from "express";
import { FineController } from "../controllers/fineController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();
const fineController = new FineController();

/**
 * @swagger
 * tags:
 *   - name: Fine
 *     description: Fine management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Fine:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *           format: double
 *           example: 50.75
 *         issuedTo:
 *           type: string
 *           example: User123
 *         issuedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-05-10T14:48:00.000Z"
 *       required:
 *         - amount
 *         - issuedTo
 *     FineResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "abc123"
 *         amount:
 *           type: number
 *           format: double
 *         issuedTo:
 *           type: string
 *         issuedAt:
 *           type: string
 *           format: date-time
 *     UpdateFineRequest:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *           format: double
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
 * /api/fine:
 *   post:
 *     summary: Create a new fine
 *     tags: [Fine]
 *     security:
 *       - bearerAuth: []
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
 *       409:
 *         description: Fine already exists
 *
 *   get:
 *     summary: Retrieve a list of fines
 *     tags: [Fine]
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
 *         description: List of fines with pagination
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
 *                   $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /api/fine/{id}:
 *   get:
 *     summary: Retrieve fine details by ID
 *     tags: [Fine]
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
 *         description: Fine details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FineResponse'
 *       404:
 *         description: Fine not found
 *
 *   put:
 *     summary: Update a fine by ID
 *     tags: [Fine]
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
 *             $ref: '#/components/schemas/UpdateFineRequest'
 *     responses:
 *       200:
 *         description: Fine updated successfully
 *       404:
 *         description: Fine not found
 *
 *   delete:
 *     summary: Delete a fine by ID
 *     tags: [Fine]
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

// Routes
router.post("/api/fine", authMiddleware, fineController.createFine);
router.get("/api/fine", authMiddleware, fineController.getAllFines);
router.get("/api/fine/:id", authMiddleware, fineController.getFineById);
router.put("/api/fine/:id", authMiddleware, fineController.updateFine);
router.delete("/api/fine/:id", authMiddleware, fineController.deleteFine);

export default router;
