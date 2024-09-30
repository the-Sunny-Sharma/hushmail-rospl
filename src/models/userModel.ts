import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: { type: String, unique: true, required: true }, // Make username required
    password: { type: String, select: false }, // Optionally required based on auth method
    image: { type: String },
    googleId: { type: String },
  },
  { timestamps: true }
); // Adding timestamps for createdAt and updatedAt fields

// Index for faster queries on email and username
userSchema.index({ email: 1, username: 1 });

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
