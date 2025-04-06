import express from "express";
import { register, login } from "../controllers/userController.js";
import {getProfile} from "../controllers/profileControllers.js"
import {protect} from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getProfile);
export default router;
