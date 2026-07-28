import path from "path";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { AuthRepository } from "../modules/auth/auth.repository";
import { isPasswordStrong } from "../utils/security";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const run = async () => {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || "Administrator";
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || !email || !password) {
    throw new Error("MONGO_URI, BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD are required");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !isPasswordStrong(password)) {
    throw new Error("Bootstrap administrator email or password does not meet security requirements");
  }

  await connectDB(mongoUri);
  const existing = await AuthRepository.findByEmail(email);
  if (existing) {
    throw new Error("A user with the bootstrap email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await AuthRepository.createUser({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });
  console.log(`Administrator created for ${email}`);
};

run()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Administrator bootstrap failed");
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
