import mongoose from "mongoose";

const specialitySchema = new mongoose.Schema(
  {
    specialityCode: {
      type: String,
      unique: true,
      required: true,
    },

    specialityTitle: {
      type: String,
      required: true,
      unique: true,
    },

    firstImage: {
      type: String,
      required: true,
    },

    mainImage: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    educationLevel: {
      type: String,
      required: true,
    },

    educationForm: {
      type: String,
      required: true,
    },

    educationPeriod: {
      type: String,
      required: true,
    },

    cvalification: {
      type: String,
      required: true,
    },

    academicDisciplines: {
      type: Array,
      required: true,
    },

    whatCanIdo: {
      type: Array,
      required: true,
    },

    whereCanIwork: {
      type: Array,
      required: true,
    },

    skills: {
      type: Array,
      required: true,
    },

    experience: {
      type: Array,
      required: true,
    },

    cvalification: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SpecialityModel", specialitySchema);
