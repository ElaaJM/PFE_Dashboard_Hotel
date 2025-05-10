// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "analyst"], required: true },
  logo: { type: String },  // Logo will store the URL of the uploaded image
});

export default mongoose.model("User", userSchema);
