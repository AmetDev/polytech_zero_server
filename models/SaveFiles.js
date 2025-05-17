import mongoose from "mongoose";

const FileBlockSchema = new mongoose.Schema(
  {
    file: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false, // Отключаем сохранение версии
  }
);

const SaveFilesSchema = new mongoose.Schema(
  {
    fileBlocksList: {
      type: [[FileBlockSchema]],
      required: true,
    },

    forPage: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false, // Отключаем сохранение версии
  }
);

export default mongoose.model("FilesSchema", SaveFilesSchema);
