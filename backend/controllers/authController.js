// controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import upload from "../middleware/upload.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    
    res.json({
      token,
      user: {
        email: user.email,
        role: user.role,
        username: user.username,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const createAnalyst = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const analyst = new User({ username, password: hashedPassword, role: "analyst" });
    await analyst.save();
    res.status(201).json({ message: "Analyst created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const registerAdmin = async (req, res) => {
  // Use multer to handle file upload
  upload.single('logo')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { username, email, password, confirmPassword } = req.body;

    // Check if username or email already exists
    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the image URL (assuming the image is saved in 'uploads' folder)
    const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;  // Save the file path

    // Create a new admin user
    const admin = new User({
      username,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,  // You may want to remove or not save confirmPassword after validation
      role: "admin",
      logo: logoUrl,  // Save the logo URL (relative to the server)
    });

    try {
      await admin.save();
      res.status(201).json({ message: "Admin created successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

