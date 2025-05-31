// routes/authRoutes.js
import express from "express";
import { login, createAnalyst, registerAdmin, getUserInfo, updateUserInfo, getAnalysts, deleteAnalyst, changePassword, uploadCsv, uploadCsvFolder, deleteCsvById, getAllCsvFiles } from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register-admin", registerAdmin);
router.post("/create-analyst", verifyToken, isAdmin, createAnalyst);
router.get("/me", verifyToken, getUserInfo);
router.put("/me", verifyToken, updateUserInfo);
router.get("/analysts", getAnalysts);
router.delete('/analysts/:id', verifyToken, deleteAnalyst);
router.post("/change-password", verifyToken, changePassword);
router.post("/upload-csv", verifyToken, uploadCsv);
router.post('/upload-csv-folder', verifyToken, uploadCsvFolder);
router.get("/csv-files", getAllCsvFiles);
router.delete("/csv/:id", deleteCsvById);


export default router;
