import express from "express";
import  {Poster}  from "../models/Poster.js"
import checkAuth from "../utils/checkAuth.js";
import checkUserIsAdmin from "../utils/checkUserIsAdmin.js";
import multer from "multer";
import path from "path";

const router = express.Router();
const UPLOADS_DIR = process.env.UPLOADS_DIR;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, "poster" + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Get the current poster
router.get("/poster", async (req, res) => {
  try {
    const poster = await Poster.findOne();
    if (!poster) {
      return res.status(404).json({ message: "No poster found" });
    }
    res.json({ imagelink: poster.path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update or set the poster (replaces existing poster)
router.post(
  "/poster",
  checkAuth,
  checkUserIsAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      // Delete existing poster from database
      await Poster.deleteMany({});

      // Save new poster
      const newPoster = new Poster({
        filename: req.file.filename,
        path: imageUrl,
      });
      await newPoster.save();

      res.json({ imagelink: imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;