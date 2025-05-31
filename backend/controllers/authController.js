// controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import upload from "../middleware/upload.js";
import File from "../models/File.js";
import path from 'path';
import fs from 'fs/promises';  // top of your file, or dynamic import
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const login = async (req, res) => {
  const { identifier, password, role } = req.body; // Use 'identifier' to accept either email or username

  try {
    // Validate input
    if (!identifier || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find user based on role
    let user;
    if (role === 'admin') {
      user = await User.findOne({ email: identifier });
    } else if (role === 'analyst') {
      user = await User.findOne({ username: identifier });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Optional: Set token expiration
    });

    // Send response
    res.json({
      token,
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
      },
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

export const getAnalysts = async (req, res) => {
  try {
    // Fetch all users with the role "analyst"
    const analysts = await User.find({ role: "analyst" }).select("-password");
    res.json(analysts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAnalyst = async (req, res) => {
  const { id } = req.params;

  // Check if the user is an admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. You don't have permission to delete this analyst." });
  }

  try {
    const analyst = await User.findByIdAndDelete(id);
    if (!analyst) {
      return res.status(404).json({ message: "Analyst not found" });
    }
    res.json({ message: "Analyst deleted successfully" });
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

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Update user profile
export const updateUserInfo = (req, res) => {
  upload.single('logo')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const userId = req.user.id;
    const { username, email } = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const updateFields = {};
      if (username) updateFields.username = username;
      if (email) updateFields.email = email;
      if (logo) updateFields.logo = logo;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User updated successfully",
        user: {
          username: updatedUser.username,
          email: updatedUser.email,
          logo: updatedUser.logo
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validate passwords
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "New password and confirmation do not match" });
  }

  try {
    // Find the user by ID (assumes req.user contains the logged-in user's ID)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CSV file upload handler
export const uploadCsv = async (req, res) => {
  upload.single('csvFile')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: 'File upload error' });
    if (!req.file) return res.status(400).json({ message: 'No CSV file uploaded' });

    try {
      const fileData = {
        filename: req.file.filename,
        path: req.file.path,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };

      // Assuming File is a Mongoose model or similar
      await new File(fileData).save();

      res.status(200).json({ 
        message: 'CSV file uploaded successfully', 
        file: fileData 
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Failed to process CSV file' });
    }
  });
};

export const uploadCsvFolder = async (req, res) => {
  upload.array('csvFiles')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: 'File upload error' });
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No CSV files uploaded' });

    try {
      const savedFiles = [];

      // Save all files metadata
      for (const file of req.files) {
        const fileData = {
          filename: file.filename,
          path: file.path,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        };
        await new File(fileData).save();
        savedFiles.push(fileData);
      }

      res.status(200).json({
        message: `${savedFiles.length} CSV files uploaded successfully`,
        files: savedFiles,
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Failed to process CSV files' });
    }
  });
};
// Get all uploaded CSV files
export const getAllCsvFiles = async (req, res) => {
  try {
    // Optionally filter by mimetype
    const files = await File.find({ mimetype: 'text/csv' }).sort({ uploadedAt: -1 });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve CSV files', error: error.message });
  }
};
export const deleteCsvById = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "CSV file not found" });

    try {
      await fs.unlink(file.path);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // File not found — that's okay, continue deleting DB record
        console.warn(`File not found on disk: ${file.path}, continuing deletion.`);
      } else {
        console.error("Error deleting file from disk:", err);
        return res.status(500).json({ message: "Error deleting file from disk" });
      }
    }

    await File.findByIdAndDelete(id);
    return res.status(200).json({ message: "CSV file deleted successfully" });

  } catch (error) {
    console.error("Failed to delete CSV file:", error);
    return res.status(500).json({ message: "Failed to delete CSV file", error: error.message });
  }
};

