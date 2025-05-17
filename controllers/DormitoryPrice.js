/* itsZeroFourX@gmail.com code side */

import DormitoryPrice from "../models/DormitoryPrice.js";
import { validationResult } from "express-validator";

export const createPriceListItem = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { period, price, forPeopleType } = req.body;

    const priceListItem = new DormitoryPrice({
      period,
      price,
      forPeopleType,
    });

    await priceListItem.save();

    res.json(priceListItem);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Не удалось создать прайс-лист",
    });
  }
};

export const deletePriceListItem = async (req, res) => {
  try {
    const priceListId = req.params.id;

    await DormitoryPrice.findOneAndDelete({ _id: priceListId })
      .then((doc) => {
        if (!doc) {
          return res.status(404).send({
            message: "Прас-лист общежития не найден",
          });
        }

        res.status(200).send({
          message: "Прас-лист удален успешно!",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Не удалось удалить прайс-лист",
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Не удалось удалить элемент парс-листа",
    });
  }
};

export const getAllDormitoryes = async (req, res) => {
  try {
    const dormitoryes = await DormitoryPrice.find();

    res.status(200).json(dormitoryes);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Не удалось получить посты",
    });
  }
};
