"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../controllers/transactionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
// Initialize express Router
const router = express_1.default.Router();
// Create instance of TransactionController to handle route logic
const transactionController = new transactionController_1.TransactionController();
/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Transaction endpoints
 */
/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Transaction already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction already exists
 *
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
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
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TransactionResponse'
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
 * /api/transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *       404:
 *         description: Transaction not found
 *
 *   put:
 *     summary: Update transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
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
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *       404:
 *         description: Transaction not found
 *
 *   delete:
 *     summary: Delete transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       204:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 */
/**
 * @swagger
 * /api/transactions/profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get transaction profile
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Transaction profile retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
// Transaction Routes:
// POST /api/transactions
// Creates a new transaction
// Request body should contain transaction details (name, description)
router.post("/", authMiddleware_1.authMiddleware, transactionController.createTransaction);
// GET /api/transactions
// Retrieves all transactions from the database
// Returns array of transactions
router.get("/", authMiddleware_1.authMiddleware, transactionController.getAllTransactions);
// GET /api/transactions/:id
// Retrieves a specific transaction by its ID
// :id - MongoDB ObjectId of the transaction
router.get("/:id", authMiddleware_1.authMiddleware, transactionController.getTransactionById);
// PUT /api/transactions/:id
// Updates an existing transaction's information
// :id - MongoDB ObjectId of the transaction to update
// Request body should contain updated transaction details
router.put("/:id", authMiddleware_1.authMiddleware, transactionController.updateTransaction);
// DELETE /api/transactions/:id
// Removes a transaction from the database
// :id - MongoDB ObjectId of the transaction to delete
router.delete("/:id", authMiddleware_1.authMiddleware, transactionController.deleteTransaction);
// Export the router for use in main application
exports.default = router;
