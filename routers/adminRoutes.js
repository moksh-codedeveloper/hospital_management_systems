import { Router } from "express";
const router = Router();
import { getAdminProfile, loginAdmin, logout } from "../controllers/adminController.js";
// import { logout } from "../controllers/userController.js";
router.get("/logoutAdmin", logout)
router.post("/loginAdmin", loginAdmin);
router.get("/getAdmin", getAdminProfile);
export default router;