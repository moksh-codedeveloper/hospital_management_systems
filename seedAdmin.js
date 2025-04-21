import bcrypt from "bcryptjs";
import User from "./models/userModels.js"; // adjust path if needed
import connectDB from "./config/db.js";

async function seedAdmin() {
  try {
    await connectDB();

    const existing = await User.findOne({ email: "admin@hms.com" });
    if (existing) {
      console.log("Admin already exists");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("kajalvaishnav234", 10);

    const admin = new User({
      name: "Admin",
      email: "admin@hms.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed admin:", err);
    process.exit(1);
  }
}

seedAdmin();
