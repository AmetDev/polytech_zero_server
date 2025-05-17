import mongoose from "mongoose";

const DormitoryPriceSchema = new mongoose.Schema({
  period: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },

  forPeopleType: {
    type: String,
    required: true,
  },
});

export default mongoose.model("DormitoryPrice", DormitoryPriceSchema);
