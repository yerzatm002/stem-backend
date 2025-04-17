const { User } = require("../models");
const admin = require("../config/firebase");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// Генерация JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
    const { email, password, name } = req.body;
  
    try {
      let user = await User.findOne({ where: { email } });
      if (user) {
        return res.status(400).json({ message: "Пользователь уже существует" });
      }
  
      console.log("🚀 Обычный пароль:", password);
  
      user = await User.create({
        email,
        password, 
        name,
      });
  
      const token = generateToken(user);
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера", error });
    }
  };
  

  exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "Неверный email или пароль" });
      }
  
      console.log("🔹 Введенный пароль:", password);
      console.log("🔹 Хранимый пароль:", user.password);
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("❌ Пароль не совпадает");
        return res.status(400).json({ message: "Неверный email или пароль" });
      }
  
      console.log("✅ Пароль совпадает");
  
      const token = generateToken(user);
      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера", error });
    }
  };
  

// 📌 Вход через Google OAuth
exports.loginWithGoogle = async (req, res) => {
  const { token } = req.body;

  try {
    // Проверяем токен в Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, picture, uid } = decodedToken;

    // Проверяем наличие пользователя
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ email, uid, name, photo: picture });
    }

    // Генерируем JWT
    const jwtToken = generateToken(user);

    res.json({ user, token: jwtToken });
  } catch (error) {
    res.status(401).json({ message: "Ошибка аутентификации", error });
  }
};

// 📌 Выход пользователя (клиент просто удаляет JWT)
exports.logout = (req, res) => {
  res.json({ message: "Вы успешно вышли" });
};

// 📌 Получение текущего пользователя
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

exports.resetPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const link = await admin.auth().generatePasswordResetLink(email);
      console.log("Reset Link:", link); // 🔹 Логируем ссылку
  
      res.json({ message: "Ссылка для сброса пароля отправлена" });
    } catch (error) {
      console.error("Firebase Error:", error); // 🔹 Логируем ошибку
      res.status(500).json({ message: "Ошибка сервера", error });
    }
  };

// 📌 Смена пароля
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
  
    try {
      const user = await User.findByPk(req.user.id);
      console.log("Stored Password:", user.password); // 🔹 Логируем текущий пароль
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Старый пароль неверный" });
      }
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.json({ message: "Пароль успешно изменен" });
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: "Ошибка сервера", error });
    }
  };
  

  exports.updateProfile = async (req, res) => {
    try {
      const { name, email, photo } = req.body;
      const userId = req.user.id;
  
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }
  
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ message: "Этот email уже используется" });
        }
      }
  
      await user.update({ name, email, photo });
      res.json({ message: "Профиль обновлен", user });
    } catch (error) {
      console.error("❌ Ошибка при обновлении профиля:", error);
      res.status(500).json({ message: "Ошибка сервера", error });
    }
  };
  