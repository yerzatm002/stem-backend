const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Токен отсутствует, доступ запрещен" });
  }

  try {

    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

    // Проверяем, существует ли пользователь
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    req.user = user; // Добавляем пользователя в req
    next();
  } catch (error) {
    res.status(401).json({ message: "Недействительный токен" });
  }
};
