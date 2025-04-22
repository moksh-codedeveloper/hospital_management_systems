import Router from 'express';
const router = Router();
import {getDoctor, getAllDoctors, addDoctor, loginDoctor, deleteDoctor, updateDoctor, logout} from "../controllers/doctorControllers.js"
import { verifyAdmin } from '../middleware/verifyAdmin.js';
// import { logout } from '../controllers/userController.js';

router.post("/create",verifyAdmin,  addDoctor);
router.get("/",verifyAdmin, getAllDoctors);
router.get("/get/:id",verifyAdmin, getDoctor);
router.patch("/update/:id",verifyAdmin, updateDoctor);
router.delete("/delete/:id",verifyAdmin, deleteDoctor);
router.post("/login", loginDoctor);
router.get("/logout", logout);
export default router;