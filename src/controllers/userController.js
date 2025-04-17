const { User } = require("../models");

// 📌 Получение информации о пользователе
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "email", "name", "photo", "role", "completedCourses", "createdAt"],
    });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Обновление профиля пользователя
exports.updateUser = async (req, res) => {
  try {
    const { name, photo } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Разрешаем обновлять только себя, если это не админ
    if (req.user.id !== user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    user.name = name || user.name;
    user.photo = photo || user.photo;
    await user.save();

    res.json({ message: "Профиль обновлен", user });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Удаление пользователя
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Разрешаем удалять только себя или если это админ
    if (req.user.id !== user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    await user.destroy();
    res.json({ message: "Пользователь удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Получение списка всех пользователей (Только для админа)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const users = await User.findAll({
      attributes: ["id", "email", "name", "photo", "role", "createdAt"],
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};
