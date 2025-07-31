import mongoose from "mongoose";

const PosterSlideSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  upload_date: {
    type: Date,
    default: Date.now,
  },
});

export const PosterSlide = mongoose.model("PosterSlide", PosterSlideSchema);