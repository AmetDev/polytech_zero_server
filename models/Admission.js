import mongoose from "mongoose";

const admissionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  admission: {
    type: String,
    required: true,
  },
});

export default mongoose.model("AdmissionModel", admissionSchema);
