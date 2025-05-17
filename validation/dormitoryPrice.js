import { body } from "express-validator";

export const dormitoryPriceValidation = [
  body("period", "Неверно указан период").isLength({ min: 2, max: 100 }),
  body("price", "Неверно указана цена").isLength({ min: 2, max: 100 }),
  body(
    "forPeopleType",
    "Неверно указано, для какого типа людей этот вариант"
  ).isLength({ min: 2, max: 100 }),
];
