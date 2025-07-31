import mongoose from "mongoose";

const PosterSchema = new mongoose.Schema({
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

export const Poster = mongoose.model("Poster", PosterSchema);