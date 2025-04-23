import User from "../models/userModels.js";
import jwt from "jsonwebtoken";  // Importing jwt for token verification

// Helper function to verify the token
const verifyToken = (token) => {
  try {
    // Verify and decode the token
    return jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT_SECRET
  } catch (err) {
    return null; // If token verification fails, return null
  }
};

// The getProfile route that uses verifyToken to get user profile
const getProfile = async (req, res) => {
  try {
    // Extract token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token not found, please login again." });
    }

    // Verify the token and extract the user ID
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized, invalid token." });
    }

    const userId = decoded.id;  // Extract user ID from the token

    // Find the user by their ID, excluding the password field
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the user profile if found
    res.status(200).json({ user });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getProfile };