import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import cron from "node-cron";
import path from "path";
import Image from "./models/Image.js";
import pdfModel from "./models/PdfFile.js";
import dormitoryRouter from "./routes/DormitoryRoutes.js";
import LinkHeader from "./routes/LinkHeader.js";
import mailer from "./routes/MailerRoutes.js";
import pageRouter from "./routes/PageRoutes.js";
import postRouter from "./routes/PostRoutes.js";
import SaveFilesRouter from "./routes/SaveFilesRoutes.js";
import scheduleRouter from "./routes/ScheduleRoutes.js";
import specialityRouter from "./routes/SpecialtiesRoutes.js";
import userRouter from "./routes/UserRoutes.js";
import AdmissionRouter from "./routes/Admission.js";

import checkAuth from "./utils/checkAuth.js";
import checkUserIsAdmin from "./utils/checkUserIsAdmin.js";
dotenv.config({ path: "./.env" });
const app = express();

/* CONSTANTS */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
// const upload = multer({ dest: 'uploads/' })
/* MIDDLEWARES */

app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "200mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "200mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Uploads will be stored in the 'uploads' directory
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Serve the HTML page with a form for image upload
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.post(
  "/uploadpdf",
  checkAuth,
  checkUserIsAdmin,
  upload.single("file"),
  async (req, res) => {
    try {
      if (req.file) {
        const pdfUrl = `/uploads/${req.file.filename}`;

        // Save PDF file details to MongoDB

        const newPdf = new pdfModel({
          filename: req.file.filename,
          path: pdfUrl,
        });

        await newPdf.save();

        res.json({ pdflink: pdfUrl }); // Only return the PDF file URL
      } else {
        res.status(400).send("No PDF file provided");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);
// Handle image upload
app.post(
  "/upload",
  checkAuth,
  checkUserIsAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (req.file) {
        const imageUrl = `/uploads/${req.file.filename}`;
        const newImage = new Image({
          filename: req.file.filename,
          path: imageUrl,
        });

        await newImage.save();

        res.json({ imagelink: imageUrl }); // Only return the image URL
      } else {
        res.status(400).send("No image file provided");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Set up static file serving for uploaded images
app.use("/uploads", express.static("uploads"));
/* ROUTES */
app.use("/auth", userRouter);
app.use("/speciality", specialityRouter);
app.use("/post", postRouter);
app.use("/dormitory", dormitoryRouter);
app.use("/page", pageRouter);
app.use("/mailer", mailer);
app.use("/schedule", scheduleRouter);
app.use("/linker", LinkHeader);
app.use("/files", SaveFilesRouter);
app.use("/admission", AdmissionRouter);

const client = new MongoClient(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function deleteOldImages(daysThreshold = 365) {
  try {
    await client.connect();

    const database = client.db("test");
    const collection = database.collection("scheduleimages");

    const currentTimestamp = new Date();
    const thresholdTimestamp = new Date(
      currentTimestamp - daysThreshold * 24 * 60 * 60 * 1000
    );

    // Находим все записи, у которых дата загрузки меньше пороговой
    const oldImages = await collection
      .find({ upload_date: { $lt: thresholdTimestamp } })
      .toArray();

    for (const image of oldImages) {
      const imagePath = image.image_path;

      // Удаляем изображение из сервера
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Удаляем запись из базы данных
      await collection.deleteOne({ _id: image._id });
    }
  } finally {
    await client.close();
  }
}

// Запуск функции удаления старых изображений по расписанию
cron.schedule(
  "0 3 * * *",
  () => {
    deleteOldImages();
  },
  {
    timezone: "Europe/Moscow",
  }
);

/* START FUNCTION */
async function start() {
  try {
    await mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Mongo db connected successfully"))
      .catch((err) => console.log(err));

    app.listen(PORT, (err) => {
      if (err) return console.log("App crashed: ", err);
      console.log(`Server started successfully! Port: ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
