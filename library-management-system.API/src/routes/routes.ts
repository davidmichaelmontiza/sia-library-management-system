import { Router } from "express";
import bookRoutes from "./bookRoutes";
import authRoutes from "./authRoutes";
import categoryRoutes from "./categoryRoutes";
import fineRoutes from "./fineRoutes";
import librarianRoutes from "./librarianRoutes";
import shelfRoutes from "./shelfRoutes";
import transactionRoutes from "./transactionRoutes";
// Import other route files here
// import productRoutes from './productRoutes';

// Create main router instance
const router = Router();

// Health check endpoint to verify API is running
router.get("/main/healthcheck", (req, res) => {
  res.status(200).json({
    message: "API is healthy",
  });
});

// Mount user routes under /api/users prefix
router.use("/api/book", bookRoutes);
router.use("/api/category", categoryRoutes);
router.use("/api/fine", fineRoutes);
router.use("/api/librarian", librarianRoutes);
router.use("/api/shelf", shelfRoutes);
router.use("/api/transaction", transactionRoutes);
router.use("/api/auth", authRoutes);
// Add other routes with their prefixes
// router.use('/api/products', productRoutes);

export default router;