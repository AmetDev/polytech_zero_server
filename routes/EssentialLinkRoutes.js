import express from "express";
import mongoose from "mongoose";
import checkAuth from "../utils/checkAuth.js";
import checkUserIsAdmin from "../utils/checkUserIsAdmin.js";

const router = express.Router();

// Define the EssentialLinks schema
const EssentialLinkSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Text is required"],
    trim: true,
    maxlength: [100, "Text cannot exceed 100 characters"],
  },
  url: {
    type: String,
    required: [true, "URL is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const EssentialLinks = mongoose.model("EssentialLink", EssentialLinkSchema);

// GET /essential-links - Retrieve all links or filter by query
router.get("/essential-links", async (req, res) => {
  try {
    const { text, url } = req.query;
    let query = {};
    if (text) query.text = { $regex: text, $options: "i" };
    if (url) query.url = url;

    const links = await EssentialLinks.find(query).sort("createdAt");
    res.status(200).json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ message: "Failed to fetch links", error: error.message });
  }
});

// POST /essential-links - Create a new link
router.post("/essential-links", checkAuth, checkUserIsAdmin, async (req, res) => {
  try {
    const { text, url } = req.body;
    if (!text || !url) {
      return res.status(400).json({ message: "Text and URL are required" });
    }

    const newLink = new EssentialLinks({ text, url });
    await newLink.save();

    res.status(201).json({ message: "Link created successfully", data: newLink });
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(500).json({ message: "Failed to create link", error: error.message });
  }
});

// PUT /essential-links/:id - Update a single link
router.put("/essential-links/:id", checkAuth, checkUserIsAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, url } = req.body;
    if (!text || !url) {
      return res.status(400).json({ message: "Text and URL are required" });
    }

    const updatedLink = await EssentialLinks.findByIdAndUpdate(
      id,
      { text, url, createdAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!updatedLink) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.status(200).json({ message: "Link updated successfully", data: updatedLink });
  } catch (error) {
    console.error("Error updating link:", error);
    res.status(500).json({ message: "Failed to update link", error: error.message });
  }
});

// DELETE /essential-links/:id - Delete a specific link
router.delete("/essential-links/:id", checkAuth, checkUserIsAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLink = await EssentialLinks.findByIdAndDelete(id);
    if (!deletedLink) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.status(200).json({ message: "Link deleted successfully", data: deletedLink });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ message: "Failed to delete link", error: error.message });
  }
});

export default router;