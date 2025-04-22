import User from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Connect to the database
        await connectDB();

        // Find admin by email and role
        const admin = await User.findOne({ email, role: "admin" });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Compare the password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Set the token in an HTTP-only cookie
        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Send success response
        console.log(`✅ Admin ${admin.email} logged in`);
        res.status(200).json({ message: "Login successful" });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAdminProfile = async (req, res) => {
    try {
        // Connect to the database
        await connectDB();

        // Get the admin ID from the JWT token
        const token = req.cookies.adminToken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminId = decoded.id;

        // Find the admin by ID
        const admin = await User.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Send the admin profile data
        res.status(200).json({admin});

    } catch (error) {
        console.error("Get admin profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const logout = (req, res) => {
  try {
    res.cookie("adminToken", "", {
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