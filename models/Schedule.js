import mongoose from "mongoose";

const ScheduleItem = new mongoose.Schema(
  {
    name: { type: String },
    lectore: { type: String },
    cabinet: { type: String },
  },
  { _id: false }
);

const Group = new mongoose.Schema(
  {
    group: { type: String, required: true },
    schedule: [ScheduleItem],
  },
  { _id: false }
);

const Week = new mongoose.Schema(
  {
    week: { type: String, required: true },
    groups: [Group],
  },
  { _id: false }
);

const Corpus = new mongoose.Schema(
  {
    number: { type: String, required: true },
    weeks: [Week],
  },
  { _id: false }
);

const GroupSchedule = new mongoose.Schema({
  corpus: Corpus,
});

export default mongoose.model("GroupSchedule", GroupSchedule);