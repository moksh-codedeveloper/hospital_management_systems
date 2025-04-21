import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },
    specialisation: {
      type: String,
      required: function () {
        return this.role === "doctor"; // Required only for doctors
      },
    },
    experience: {
      type: Number,
      required: function () {
        return this.role === "doctor"; // Required only for doctors
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
