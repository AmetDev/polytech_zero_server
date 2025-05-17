import mongoose from "mongoose";
const ScheduleImage = new mongoose.Schema(
  {
    scheduleOne: { type: String, required: true },
    scheduleTwo: { type: String, required: true },
    date: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("ScheduleImage", ScheduleImage);
