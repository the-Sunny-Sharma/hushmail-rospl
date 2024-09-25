import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true },
  password: { type: String, required: false, select: false },
  image: { type: String },
  googleId: { type: String },
});

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
