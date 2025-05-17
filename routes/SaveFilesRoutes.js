import express from "express";
import { SaveFilesController } from "../controllers/index.js";

const router = express.Router();

router.post("/create", SaveFilesController.createFilesBlocks);
router.get("/get", SaveFilesController.getFileBlocks);
router.patch("/update", SaveFilesController.updateFiles);

export default router;
