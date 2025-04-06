import express from "express";
import { createAppointment, getAppointments,updateAppointment,deleteAppointment } from "../controllers/appointmentController.js";
import { protect } from "../middlewares/protected.js";

const router = express.Router();

// POST new appointment
router.post("/", protect, createAppointment);

// GET user's appointments
router.get("/", protect, getAppointments);

export default router;
router.put('/update/:id', protect, updateAppointment);
router.delete('/delete/:id', protect, deleteAppointment);
