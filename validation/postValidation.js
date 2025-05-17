import { body } from "express-validator";

export const postValidation = [
  body("image", "Неверный формат изображения").isString(),
  body("title", "Неверный формат заголовка").isLength({ min: 2, max: 50 }),
  body("subtitle", "Неверный формат подзаголовка").isLength({
    min: 2,
    max: 50,
  }),
  body("text", "Неверный формат текста").isLength({ min: 2 }),
];
