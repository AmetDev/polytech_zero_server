import express from "express";
import { createAdmission } from "../controllers/AdmissionControllers.js";
import checkAuth from "../utils/checkAuth.js";
import checkUserIsAdmin from "../utils/checkUserIsAdmin.js";

const router = express.Router();

router.post("/create", createAdmission);

export default router;
