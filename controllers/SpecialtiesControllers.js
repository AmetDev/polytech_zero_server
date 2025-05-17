/* itsZeroFour@gmail.com code side */

import { validationResult } from "express-validator";
import SpecialityModel from "../models/Speciality.js";

export const createSpeciality = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const {
      specialityCode,
      specialityTitle,
      firstImage,
      mainImage,
      description,
      educationLevel,
      educationForm,
      educationPeriod,
      cvalification,
      academicDisciplines,
      whatCanIdo,
      whereCanIwork,
      skills,
      experience,
    } = req.body;

    const newSpeciality = new SpecialityModel({
      specialityCode,
      specialityTitle,
      firstImage,
      mainImage,
      description,
      educationLevel,
      educationForm,
      educationPeriod,
      cvalification,
      academicDisciplines,
      whatCanIdo,
      whereCanIwork,
      skills,
      experience,
    });

    await newSpeciality.save();

    res.json(newSpeciality);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Не удалось создать новую специальность",
    });
  }
};

export const updateSpeciality = async (req, res) => {
  try {
    const specialityId = req.params.id;

    await SpecialityModel.updateOne(
      { _id: specialityId },
      {
        specialityCode: req.body.specialityCode,
        specialityTitle: req.body.specialityTitle,
        firstImage: req.body.image,
        mainImage: req.body.mainImage,
        description: req.body.description,
        educationLevel: req.body.educationLevel,
        educationForm: req.body.educationForm,
        educationPeriod: req.body.educationPeriod,
        cvalification: req.body.cvalification,
        academicDisciplines: req.body.academicDisciplines,
        whatCanIdo: req.body.whatCanIdo,
        whereCanIwork: req.body.whereCanIwork,
        skills: req.body.skills,
        experience: req.body.experience,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Не удалось обновить пользователя",
    });
  }
};

export const getOneSpeciality = async (req, res) => {
  try {
    const specialityId = req.params.id;

    const speciality = await SpecialityModel.findById(specialityId);

    res.json(speciality);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Не удалось получить данные о специальности",
    });
  }
};

export const getAllSpecialities = async (req, res) => {
  try {
    const specialties = await SpecialityModel.find();

    res.json(specialties);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Не удалось получить специальности",
    });
  }
};

export const deleteSpecialities = async (req, res) => {
  try {
    const specialityId = req.params.id;

    SpecialityModel.findOneAndDelete({
      _id: specialityId,
    })
      .then((doc) => {
        if (!doc) {
          return res.status(404).send({
            message: "Не удалось найти специальность",
          });
        }

        res.status(200).send({
          success: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Не удалось удалить специальность",
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Не удалось удалить специальность",
    });
  }
};
