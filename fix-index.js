import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

const fixIndexIssue = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log("Connected to MongoDB");

    // Get the User model's collection
    const db = mongoose.connection.db;
    const collection = db.collection("users");

    // Get all indexes on the collection
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes);

    // Check if username_1 index exists
    const usernameIndex = indexes.find(index => index.name === "username_1");
    
    if (usernameIndex) {
      // Drop the username_1 index
      await collection.dropIndex("username_1");
      console.log("Successfully dropped the username_1 index");
      
      // Verify indexes after removal
      const updatedIndexes = await collection.indexes();
      console.log("Updated indexes:", updatedIndexes);
    } else {
      console.log("No username_1 index found");
    }

    console.log("Index fix completed successfully");
  } catch (error) {
    console.error("Error fixing indexes:", error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
};

// Run the function
fixIndexIssue();

