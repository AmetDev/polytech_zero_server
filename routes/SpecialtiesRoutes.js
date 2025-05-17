import express from "express";
import { createSpecialityValidation } from "../validation/specialityValidation.js";
import checkAuth from "../utils/checkAuth.js";
import checkUserIsAdmin from "../utils/checkUserIsAdmin.js";
import { SpecialtiesControllers } from "../controllers/index.js";

const router = express.Router();

router.post(
  "/create",
  // checkAuth,
  // checkUserIsAdmin,
  // createSpecialityValidation,
  SpecialtiesControllers.createSpeciality
);
router.patch(
  "/update/:id",
  checkAuth,
  checkUserIsAdmin,
  createSpecialityValidation,
  SpecialtiesControllers.updateSpeciality
);
router.get("/getSpeciality/:id", SpecialtiesControllers.getOneSpeciality);
router.get("/getSpecialities", SpecialtiesControllers.getAllSpecialities);
router.delete(
  "/delete/:id",
  checkAuth,
  checkUserIsAdmin,
  SpecialtiesControllers.deleteSpecialities
);

export default router;
