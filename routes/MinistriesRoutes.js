import express from "express";
import mongoose from "mongoose";
import checkAuth from "../utils/checkAuth.js";
import checkUserIsAdmin from "../utils/checkUserIsAdmin.js";

const router = express.Router();

const MinistrySchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "URL is required"],
    trim: true,
    match: [/^https?:\/\/[^\s/$.?#].[^\s]*$/, "Please enter a valid URL"],
  },
  text: {
    type: String,
    required: [true, "Text is required"],
    trim: true,
    maxlength: [100, "Text cannot exceed 100 characters"],
  },
  sourceImage: {
    type: String,
    required: [true, "Image path is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ministry = mongoose.model("Ministry", MinistrySchema);

// GET /ministries - Retrieve all ministries with optional filtering
router.get("/ministries", async (req, res) => {
  try {
    const { text, url, sourceImage } = req.query;
    let query = {};
    if (text) query.text = { $regex: text, $options: "i" };
    if (url) query.url = url;
    if (sourceImage) query.sourceImage = sourceImage;

    // Fetch all ministries if no query parameters are provided, otherwise apply filters
    const ministries = await Ministry.find(query).sort("createdAt");
    res.status(200).json(ministries);
  } catch (error) {
    console.error("Error fetching ministries:", error);
    res.status(500).json({ message: "Failed to fetch ministries", error: error.message });
  }
});

// POST /ministries - Create a new ministry
router.post("/ministries", checkAuth, checkUserIsAdmin, async (req, res) => {
  try {
    const { url, text, sourceImage } = req.body;
    if (!url || !text || !sourceImage) {
      return res.status(400).json({ message: "URL, text, and sourceImage are required" });
    }
    const newMinistry = new Ministry({ url, text, sourceImage });
    await newMinistry.save();
    res.status(201).json({ message: "Ministry created successfully", data: newMinistry });
  } catch (error) {
    console.error("Error creating ministry:", error);
    res.status(500).json({ message: "Failed to create ministry", error: error.message });
  }
});

// PUT /ministries - Update a ministry with query
router.put("/ministries", checkAuth, checkUserIsAdmin, async (req, res) => {
  try {
    const { id, url, text, sourceImage } = req.query;
    console.log("id, url, text, sourceImage", id, url, text, sourceImage)
    if (!id) {
      return res.status(400).json({ message: "ID is required for update" });
    }
    if (!url || !text || !sourceImage) {
      return res.status(400).json({ message: "URL, text, and sourceImage are required" });
    }
    const updatedMinistry = await Ministry.findByIdAndUpdate(
      id,
      { url, text, sourceImage, createdAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!updatedMinistry) {
      return res.status(404).json({ message: "Ministry not found" });
    }
    res.status(200).json({ message: "Ministry updated successfully", data: updatedMinistry });
  } catch (error) {
    console.error("Error updating ministry:", error);
    res.status(500).json({ message: "Failed to update ministry", error: error.message });
  }
});

// DELETE /ministries - Delete a ministry with query
router.delete("/ministries", checkAuth, checkUserIsAdmin, async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "ID is required for deletion" });
    }
    const deletedMinistry = await Ministry.findByIdAndDelete(id);
    if (!deletedMinistry) {
      return res.status(404).json({ message: "Ministry not found" });
    }
    res.status(200).json({ message: "Ministry deleted successfully", data: deletedMinistry });
  } catch (error) {
    console.error("Error deleting ministry:", error);
    res.status(500).json({ message: "Failed to delete ministry", error: error.message });
  }
});

export default router;