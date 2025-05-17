import { body } from "express-validator";

export const createSpecialityValidation = [
  body("specialityCode", "Неверный формат кода специальности").isLength({
    min: 2,
    max: 15,
  }),
  body("specialityTitle", "Неверный формат названия специальности").isLength({
    min: 2,
    max: 100,
  }),
  body("cvalification", "Неверный формат квалификации").optional().isString(),
  body("image", "Неверный формат изображения").isString(),
];
