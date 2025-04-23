import userModels from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../config/db.js";
export const addDoctor = async (req, res) => {
    try{
        // Connect to the database
        await connectDB();
        // console.log("Connected to the database");
        const {username, email, password, specialisation, experience} = req.body;
        // console.log("Request body:", req.body, "Username:", username, "Email:", email, "Password:", password, "Specialisation:", specialisation, "Experience:", experience);
        const isUser = await userModels.findOne({email});
        // console.log("Is user:", isUser);
        if(isUser) {
            return res.status(400).json({message: "User already exists"});
        }
        // console.log("User does not exist");
        if(!specialisation || !experience) {
            return res.status(400).json({message: "Please provide all fields"});
        }
       const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModels({
            username,
            email,
            password: hashedPassword,
            role: "doctor",
            specialisation,
            experience
        });
        console.log("New user:", newUser);
        await newUser.save();
        res.status(201).json({message: "Doctor added successfully", data: newUser});
    } catch (error) {
        console.error("Error in addDoctor:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Connect to the database
        await connectDB();

        // Find the doctor by email and role: "doctor"
        const doctor = await userModels.findOne({ email, role: "doctor" });
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
        res.cookie("doctorToken", token, {
            httpOnly: true,
        })
        // Respond with the token
        res.status(200).json({ message: "Login successful", token, doctor: { id: doctor._id, name: doctor.name, email: doctor.email, role: doctor.role } });
        console.log("Doctor logged in successfully", doctor);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDoctor = async (req, res) => {
    const {id} = req.params;
    try {
        const doctor = await userModels.findById(id);
        if(!doctor || !doctor.role === "doctor") {
            return res.status(404).json({message: "Doctor not found"});
        }
        res.status(200).json({message: "Doctor found", doctor});
        console.log("Doctor found", doctor);
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
        console.log("Doctors found", doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const deleteDoctor = async (req, res) => {
    const {id} = req.params;
    try {
        const doctor = await userModels.findById(id);
        if(!doctor || doctor.role !== "doctor") {
            return res.status(404).json({message: "Doctor not found"});
        }
        await userModels.findByIdAndDelete(id);
        res.status(200).json({message: "Doctor deleted successfully"});
        console.log("Doctor deleted successfully", doctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const updateDoctor = async (req, res) => {
    const { id } = req.params;
    const { username, email, specialisation, experience } = req.body;

    try {
        const doctor = await userModels.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Update fields if provided
        if (username) doctor.username = username;
        if (email) doctor.email = email;
        if (specialisation) doctor.specialisation = specialisation;
        if (experience) doctor.experience = experience;

        await doctor.save();

        res.status(200).json({ message: "Doctor updated successfully", doctor });
        console.log("Doctor updated successfully", doctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const logout = (req, res) => {
    try {
      res.cookie("doctorToken", "", {
        httpOnly: true,
        expires: new Date(0), // Expire immediately
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return res.status(200).json({
        message: "Logout successful",
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  };
