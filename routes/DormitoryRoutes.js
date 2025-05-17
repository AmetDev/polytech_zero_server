import express from "express";
import checkAuth from "../utils/checkAuth.js";
import checkUserIsAdmin from "../utils/checkUserIsAdmin.js";
import { dormitoryPriceValidation } from "../validation/dormitoryPrice.js";
import { DormitoryPrice } from "../controllers/index.js";

const router = express.Router();

router.post(
  "/create",
  checkAuth,
  checkUserIsAdmin,
  dormitoryPriceValidation,
  DormitoryPrice.createPriceListItem
);
router.delete(
  "/delete",
  checkAuth,
  checkUserIsAdmin,
  DormitoryPrice.deletePriceListItem
);
router.get("/getAll", DormitoryPrice.getAllDormitoryes);

export default router;
