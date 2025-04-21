import userModels from "../models/userModels";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../config/db.js";
export const addDoctor = async (req, res) => {
    try{
        // Connect to the database
        await connectDB();
        const {name, email, password, specialisation, experience} = req.body;
        const isUser = await userModels.findOne({email});
        if(isUser) {
            return res.status(400).json({message: "User already exists"});
        }
        if(!specialisation || !experience) {
            return res.status(400).json({message: "Please provide all fields"});
        }
       const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModels({
            name,
            email,
            password: hashedPassword,
            role: "doctor",
            specialisation,
            experience
        });
        await newUser.save();
        res.status(201).json({message: "Doctor added successfully", data: newUser});
    } catch (error) {
        console.error("Error in addDoctor:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const loginDoctor = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Connect to the database
        await connectDB();

        // Find the doctor by email and role: "doctor"
        const doctor = await User.findOne({ email, role: "doctor" });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, doctor.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: doctor._id, role: doctor.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // Respond with the token
        res.status(200).json({ message: "Login successful", token, doctor: { id: doctor._id, name: doctor.name, email: doctor.email, role: doctor.role } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDoctor = async (req, res) => {
    const {doctorID} = req.params;
    try {
        const doctor = await userModels.findById(doctorID);
        if(!doctor || !doctor.role === "doctor") {
            return res.status(404).json({message: "Doctor not found"});
        }
        res.status(200).json({message: "Doctor found", doctor});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await userModels.find({role: "doctor"});
        if(!doctors) {
            return res.status(404).json({message: "No doctors found"});
        }
        res.status(200).json({message: "Doctors found", doctors});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const deleteDoctor = async (req, res) => {
    const {doctorID} = req.params;
    try {
        const doctor = await userModels.findById(doctorID);
        if(!doctor || doctor.role !== "doctor") {
            return res.status(404).json({message: "Doctor not found"});
        }
        await userModels.findByIdAndDelete(doctorID);
        res.status(200).json({message: "Doctor deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const updateDoctor = async (req, res) => {
    const { doctorID } = req.params;
    const { name, email, specialization, experience } = req.body;

    try {
        const doctor = await userModels.findById(doctorID);
        if (!doctor || doctor.role !== "doctor") {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Update fields if provided
        if (name) doctor.name = name;
        if (email) doctor.email = email;
        if (specialization) doctor.specialization = specialization;
        if (experience) doctor.experience = experience;

        await doctor.save();

        res.status(200).json({ message: "Doctor updated successfully", doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


