
import {Appointment} from '../models/appointmentModel.js';
// @desc    Create new appointment
// @route   POST /api/appointments/create
// @access  Protected
const createAppointment = async (req, res) => {
  try {
    const { doctorName, department, appointmentDate, appointmentTime, reason, patientName } = req.body;
    console.log("User from request:", req.user);
    console.log("Request body:", req.body);
    if (!doctorName || !department || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const appointment = await Appointment.create({
      user: req.user._id, // comes from the protect middleware
      doctorName,
      department,
      appointmentDate,
      appointmentTime,
      reason,
      patientName,
    });

    res.status(201).json({appointment});
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all appointments for the logged-in user
// @route   GET /api/appointments/my
// @access  Protected
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).sort({ appointmentDate: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update an appointment
// @route   PUT /api/appointments/:id
// @access  Protected
const updateAppointment = async (req, res) => {
    try {
      const { _id, ...updateData } = req.body;
  
      const appointment = await Appointment.findById(_id);
      if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
  
      if (appointment.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
  
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        _id,
        updateData,
        { new: true }
      );
  
      res.status(200).json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
  

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Protected
const deleteAppointment = async (req, res) => {
    try {
      const { _id } = req.body;
  
      const appointment = await Appointment.findById(_id);
      if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
  
      if (appointment.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
  
      await appointment.deleteOne();
      res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
}; 
export{
    createAppointment,
    getMyAppointments,
    updateAppointment,
    deleteAppointment,
}
