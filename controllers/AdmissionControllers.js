import Admission from "../models/Admission.js";

export const createAdmission = async (res, req) => {
  try {
    const { title, admission } = req.body;

    if (!title || !admission) {
      res.status(404).json({
        message: "Заполните все поля",
      });

      return;
    }

    const newAdmission = new Admission({
      title,
      admission,
    });

    await admission.save();

    return res.status(200).json(newAdmission);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Список не найден",
    });
  }
};
