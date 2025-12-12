const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  batch: {
    type: String,
    required: [true, "Batch year is required"],
    trim: true,
  },
  currentCompany: {
    type: String,
    required: [true, "Current company is required"],
    trim: true,
  },
  jobRole: {
    type: String,
    required: [true, "Job role is required"],
    trim: true,
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  linkedIn: {
    type: String,
    trim: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
alumniSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Alumni", alumniSchema);
