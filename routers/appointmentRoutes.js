import express from 'express';
import {Router} from "express";
const router = Router();

import {
    createAppointment,
    getMyAppointments,
    updateAppointment,
    deleteAppointment
} from '../controllers/appointmentControllers.js';
import { protect } from '../middleware/authMiddleware.js';
// ✅ Create new appointment
router.post('/create', protect, createAppointment);

// ✅ Get all appointments for logged-in user
router.get('/my', protect, getMyAppointments);

// ✅ Update appointment — via POST to avoid param headaches
router.post('/update', protect, updateAppointment); // expects appointmentId in body

// ✅ Delete appointment — via POST to avoid param headaches
router.post('/delete', protect, deleteAppointment); // expects appointmentId in body

// module.exports = router;
export default router;
