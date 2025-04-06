import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routers/userRoutes.js"
import connectDB from "./config/db.js";
dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});


app.listen(process.env.PORT, () => {
console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;