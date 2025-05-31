// models/File.js
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  originalname: String,
  mimetype: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model('File', fileSchema);
