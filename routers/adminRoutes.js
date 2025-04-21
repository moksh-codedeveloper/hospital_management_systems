import { Router } from "express";
const router = Router();
import { getAdminProfile, loginAdmin } from "../controllers/adminController";
import { logout } from "../controllers/userController";
router.get("/logoutAdmin", logout)
router.post("/loginAdmin", loginAdmin);
router.get("getAdmin", getAdminProfile);
export default router;