import express from "express";
import { register, login, logout } from "../controllers/userController.js";
import {getProfile} from "../controllers/profileControllers.js"
import {protect} from "../middleware/authMiddleware.js";
import { getMe } from "../controllers/meControllers.js";
const router = express.Router();
router.get("/logout", logout);
router.get("/me", protect, getProfile);
router.post("/register", register);
router.post("/login", login);
router.get("/token/me", getMe);
export default router;
