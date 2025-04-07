import Appointment from "../models/appointmentModel.js";

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private (Patient only)
export const createAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason } = req.body;

    const appointment = new Appointment({
      patient: req.user.id,
      doctor,
      date,
      time,
      reason,
    });

    await appointment.save();

    res.status(201).json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Failed to create appointment", error: error.message });
  }
};

// @desc    Get all appointments for the logged-in patient
// @route   GET /api/appointments
// @access  Private (Patient only)
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).sort({ date: 1 });

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
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this appointment" });
    }

    await appointment.deleteOne();
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment", error: error.message });
  }
};
