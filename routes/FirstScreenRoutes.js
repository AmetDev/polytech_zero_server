import express from "express";
import mongoose from "mongoose";
import checkAuth from "../utils/checkAuth.js";
import checkUserIsAdmin from "../utils/checkUserIsAdmin.js";

const router = express.Router();

const FirstScreenSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: [true, "College name is required"],
    trim: true,
    maxlength: [100, "College name cannot exceed 100 characters"],
  },
  buttonLink: {
    type: String,
    required: [true, "Button link is required"],
    trim: true,
    match: [/^https?:\/\/[^\s/$.?#].[^\s]*$/, "Please enter a valid URL"],
  },
  iconPath: {
    type: String,
    required: [true, "Icon path is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FirstScreen = mongoose.model("FirstScreen", FirstScreenSchema);

// GET /firstscreen - Retrieve FirstScreen data
router.get("/firstscreen", async (req, res) => {
  try {
    const firstScreenData = await FirstScreen.findOne().sort({ createdAt: -1 });
    if (!firstScreenData) {
      return res.status(404).json({ message: "No FirstScreen data found" });
    }
    res.status(200).json(firstScreenData);
  } catch (error) {
    console.error("Error fetching FirstScreen data:", error);
    res.status(500).json({ message: "Failed to fetch FirstScreen data", error: error.message });
  }
});

// POST /firstscreen - Create FirstScreen data with query parameters
router.post("/firstscreen", checkAuth, checkUserIsAdmin, async (req, res) => {
  try {
    const { collegeName, buttonLink, iconPath } = req.query;
    if (!collegeName || !buttonLink || !iconPath) {
      return res.status(400).json({ message: "collegeName, buttonLink, and iconPath are required" });
    }

    const existingData = await FirstScreen.findOne().sort({ createdAt: -1 });
    if (existingData) {
      return res.status(400).json({ message: "FirstScreen data already exists, use PUT to update" });
    }

    const newFirstScreen = new FirstScreen({ collegeName, buttonLink, iconPath });
    await newFirstScreen.save();

    res.status(201).json({ message: "FirstScreen data created successfully", data: newFirstScreen });
  } catch (error) {
    console.error("Error creating FirstScreen data:", error);
    res.status(500).json({ message: "Failed to create FirstScreen data", error: error.message });
  }
});

// PUT /firstscreen - Update FirstScreen data with query parameters
router.put("/firstscreen", checkAuth, checkUserIsAdmin, async (req, res) => {
  try {
    const { collegeName, buttonLink, iconPath } = req.query;
    if (!collegeName || !buttonLink || !iconPath) {
      return res.status(400).json({ message: "collegeName, buttonLink, and iconPath are required" });
    }

    let firstScreenData = await FirstScreen.findOne().sort({ createdAt: -1 });
    if (!firstScreenData) {
      return res.status(404).json({ message: "No FirstScreen data found, use POST to create" });
    }

    firstScreenData = await FirstScreen.findByIdAndUpdate(
      firstScreenData._id,
      { collegeName, buttonLink, iconPath, createdAt: new Date() },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({ message: "FirstScreen data updated successfully", data: firstScreenData });
  } catch (error) {
    console.error("Error updating FirstScreen data:", error);
    res.status(500).json({ message: "Failed to update FirstScreen data", error: error.message });
  }
});

// DELETE /firstscreen - Optional delete (if needed)
router.delete("/firstscreen", checkAuth, checkUserIsAdmin, async (req, res) => {
  try {
    const deletedData = await FirstScreen.findOneAndDelete().sort({ createdAt: -1 });
    if (!deletedData) {
      return res.status(404).json({ message: "No FirstScreen data found to delete" });
    }
    res.status(200).json({ message: "FirstScreen data deleted successfully", data: deletedData });
  } catch (error) {
    console.error("Error deleting FirstScreen data:", error);
    res.status(500).json({ message: "Failed to delete FirstScreen data", error: error.message });
  }
});

export default router;