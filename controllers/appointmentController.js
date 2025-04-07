import Appointment from "../models/appointmentModel.js";
import connectDB from "../config/db.js";
import mongoose from "mongoose";
// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private (Patient only)
export const createAppointment = async (req, res) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");
    console.log("Request body:", req.body);
    const { doctor, date, time, reason } = req.body;
    
    // Skip authentication check for now to isolate the issue
    // Create a placeholder patient ID instead of using req.user._id
    const patientId = req.user?._id || new mongoose.Types.ObjectId(); // Generate a valid ObjectId
    
    const appointment = new Appointment({
      patient: patientId,
      doctorName: doctor, // Map doctor to doctorName
      appointmentDate: date, // Map date to appointmentDate
      time,
      reason,
      status: "Scheduled" // Include status field with default value
    });
    
    console.log("Attempting to save appointment:", JSON.stringify(appointment, null, 2));
    
    const savedAppointment = await appointment.save();
    
    console.log("Appointment saved successfully");
    
    res.status(201).json({ 
      message: "Appointment created successfully", 
      appointment: savedAppointment 
    });
  } catch (error) {
    console.warn("Full error details:", error);
    res.status(500).json({ 
      message: "Failed to create appointment", 
      error: error.message,
      details: error.errors // Include validation errors
    });
  }
};
// @desc    Get all appointments for the logged-in patient
// @route   GET /api/appointments
// @access  Private (Patient only)
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).sort({ date: 1 });
    console.log(appointments);
    res.status(200).json({appointments});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
  }
};
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this appointment" });
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error: error.message });
  }
};
export const deleteAppointment = async (req, res) => {
  try {
    // await connectDB();
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    console.log("User making request:", req.user?.id);
    console.log("Appointment owner:", appointment.patient.toString());

    // Check if the logged-in user is the one who created the appointment
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this appointment" });
    }

    // Delete the appointment
    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment", error: error.message });
  }
};
