import express from "express";
import { PosterSlide } from "../models/PosterSlide.js";
import checkAuth from "../utils/checkAuth.js";
import checkUserIsAdmin from "../utils/checkUserIsAdmin.js";
import multer from "multer";
import path from "path";
import fs from "fs"; // Added for file system operations

const router = express.Router();
const UPLOADS_DIR = process.env.UPLOADS_DIR;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Get all poster slides
router.get("/slides", async (req, res) => {
  try {
    const slides = await PosterSlide.find();
    res.json(slides.map(slide => ({ imagelink: slide.path })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add a new slide (multiple file upload)
router.post(
  "/slides",
  checkAuth,
  checkUserIsAdmin,
  upload.array("images", 10), // Allow up to 10 images
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No image files provided" });
      }

      const newSlides = req.files.map(file => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
      }));

      await PosterSlide.insertMany(newSlides);
      res.json({ message: "Slides added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Delete a slide by path using query parameter
router.delete("/slides", checkAuth, checkUserIsAdmin, async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) {
      return res.status(400).json({ message: "Path query parameter is required" });
    }

    // Find and delete the slide by exact path match
    const slide = await PosterSlide.findOneAndDelete({ path });
    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }
    res.json({ message: "Slide deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
export default router;