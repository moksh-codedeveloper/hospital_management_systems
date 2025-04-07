import express from "express";
import { createAppointment, getAppointments,updateAppointment,deleteAppointment } from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST new appointment
router.post("/create", protect, createAppointment);

// GET user's appointments
router.get("/get", protect, getAppointments);

// ✅ Update and Delete appointment using :id
router
  .route("/:id")
  .patch(protect, updateAppointment)   // PATCH: Update appointment
  .delete(protect, deleteAppointment); // DELETE: Delete appointment
export default router;