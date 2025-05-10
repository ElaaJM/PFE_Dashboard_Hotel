// routes/authRoutes.js
import express from "express";
import { login, createAnalyst, registerAdmin } from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register-admin", registerAdmin);
router.post("/create-analyst", verifyToken, isAdmin, createAnalyst);

export default router;
