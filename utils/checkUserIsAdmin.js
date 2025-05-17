import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);

      const user = await User.findById(decoded);

      if (user.isAdmin) {
        return next();
      }

      res.status(500).send({
        message: "You is not Admin",
      });
    } catch (err) {
      return res.status(500).send({
        message: "Access denied",
      });
    }
  } else {
    return res.status(500).send({
      message: "Access denied",
    });
  }
};
