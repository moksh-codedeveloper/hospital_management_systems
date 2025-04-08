import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routers/userRoutes.js"
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import appointmentRoutes from "./routers/appointmentRoutes.js"
dotenv.config();
connectDB();
const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));


app.use("/api/auth", authRoutes);
app.use("/api/appointments",appointmentRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});


app.listen(process.env.PORT, () => {
console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;