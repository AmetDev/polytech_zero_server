import SaveFiles from "../models/SaveFiles.js";

export const createFilesBlocks = async (req, res) => {
  try {
    const { fileBlocksList, forPage } = req.body;

    if (!fileBlocksList || !forPage) {
      return res.status(400).json({
        message: "Все поля обязательны для заполнения",
      });
    }

    const fileBlocks = new SaveFiles({ fileBlocksList, forPage });

    await fileBlocks.save();

    return res.status(200).json({
      message: "Успешно!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать блоки с файлами",
    });
  }
};

export const getFileBlocks = async (req, res) => {
  try {
    const { forPage } = req.query;

    if (!forPage) {
      return res.status(400).json({
        message: "Не удалось получить страницу",
      });
    }

    const files = await SaveFiles.findOne({ forPage });

    return res.status(200).json(files.fileBlocksList);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить файлы",
    });
  }
};

export const updateFiles = async (req, res) => {
  try {
    const { forPage, fileBlocksList } = req.body;

    if (!forPage) {
      return res.status(404).json({
        message: "Не удалось получить страницу",
      });
    }

    await SaveFiles.findOneAndUpdate({ forPage }, { fileBlocksList });

    return res.status(200).json({
      message: "Успешно!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить файлы",
    });
  }
};
