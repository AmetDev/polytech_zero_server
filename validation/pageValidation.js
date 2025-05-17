import { body } from "express-validator";

export const pageValidation = [
  body("pageUrl", "Неверный формат url`а").isString(),
  body("title1", "Неверный формат заголовка").optional().isLength({min: 2, max: 100}),
  body("text1", "Неверный формат текста").optional().isLength({min: 2, max: 100}),
  body("image1", "Неверный формат изображения").optional().isLength({min: 2, max: 100}),
  body("list1", "Неверный формат списка").optional().isArray(),
  body("block1", "Неверный формат блока с текстом").optional().isObject(),
  body("links1", "Неверный формат ссылок").optional().isArray(),

  body("title2", "Неверный формат заголовка").optional().isLength({min: 2, max: 100}),
  body("text2", "Неверный формат текста").optional().isLength({min: 2, max: 100}),
  body("image2", "Неверный формат изображения").optional().isLength({min: 2, max: 100}),
  body("list2", "Неверный формат списка").optional().isArray(),
  body("block2", "Неверный формат блока с текстом").optional().isObject(),
  body("links2", "Неверный формат ссылок").optional().isArray(),

  body("title3", "Неверный формат заголовка").optional().isLength({min: 2, max: 100}),
  body("text3", "Неверный формат текста").optional().isLength({min: 2, max: 100}),
  body("image3", "Неверный формат изображения").optional().isLength({min: 2, max: 100}),
  body("list3", "Неверный формат списка").optional().isArray(),
  body("block3", "Неверный формат блока с текстом").optional().isObject(),
  body("links3", "Неверный формат ссылок").optional().isArray(),

  body("title4", "Неверный формат заголовка").optional().isLength({min: 2, max: 100}),
  body("text4", "Неверный формат текста").optional().isLength({min: 2, max: 100}),
  body("image4", "Неверный формат изображения").optional().isLength({min: 2, max: 100}),
  body("list4", "Неверный формат списка").optional().isArray(),
  body("block4", "Неверный формат блока с текстом").optional().isObject(),
  body("links4", "Неверный формат ссылок").optional().isArray(),
];

export const updatePageValidation = [
  body("title1", "Неверный формат заголовка").optional().isLength({min: 2, max: 100}),
  body("text1", "Неверный формат текста").optional().isLength({min: 2, max: 100}),
  body("image1", "Неверный формат изображения").optional().isLength({min: 2, max: 100}),
  body("list1", "Неверный формат списка").optional().isArray(),
  body("block1", "Неверный формат блока с текстом").optional().isObject(),
  body("links1", "Неверный формат ссылок").optional().isArray(),

  body("title2", "Неверный формат заголовка").optional().isLength({min: 2, max: 100}),
  body("text2", "Неверный формат текста").optional().isLength({min: 2, max: 100}),
  body("image2", "Неверный формат изображения").optional().isLength({min: 2, max: 100}),
  body("list2", "Неверный формат списка").optional().isArray(),
  body("block2", "Неверный формат блока с текстом").optional().isObject(),
  body("links2", "Неверный формат ссылок").optional().isArray(),

  body("title3", "Неверный формат заголовка").optional().isLength({min: 2, max: 100}),
  body("text3", "Неверный формат текста").optional().isLength({min: 2, max: 100}),
  body("image3", "Неверный формат изображения").optional().isLength({min: 2, max: 100}),
  body("list3", "Неверный формат списка").optional().isArray(),
  body("block3", "Неверный формат блока с текстом").optional().isObject(),
  body("links3", "Неверный формат ссылок").optional().isArray(),

  body("title4", "Неверный формат заголовка").optional().isLength({min: 2, max: 100}),
  body("text4", "Неверный формат текста").optional().isLength({min: 2, max: 100}),
  body("image4", "Неверный формат изображения").optional().isLength({min: 2, max: 100}),
  body("list4", "Неверный формат списка").optional().isArray(),
  body("block4", "Неверный формат блока с текстом").optional().isObject(),
  body("links4", "Неверный формат ссылок").optional().isArray(),
];