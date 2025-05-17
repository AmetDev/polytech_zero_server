/* itsZeroFourX@gmail.com code side */

import Schedule from "../models/Schedule.js";

export const createSchedule = async (req, res) => {
  try {
    const { corpus } = req.body;

    if (!corpus) {
      return res.status(401).json({
        message: "Заполните все поля",
      });
    }

    const schedule = new Schedule({ corpus });

    await schedule.save();

    res.status(200).json(schedule);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать расписание",
    });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const scheduleId = await req.params.id;

    await Schedule.updateOne({ _id: scheduleId }, { corpus: corpus });

    res.status(200).json({ message: "Успешно!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить расписание",
    });
  }
};
