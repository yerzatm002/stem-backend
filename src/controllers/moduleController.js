const { Module, Course, User } = require("../models");

// 📌 Получение информации о модуле
exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id);

    if (!module) {
      return res.status(404).json({ message: "Модуль не найден" });
    }

    res.json(module);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Создание нового модуля (только для админа)
exports.createModule = async (req, res) => {
  try {
    // Проверяем права доступа (только админ может создавать модули)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const { title, content, courseId, videoUrl, materialsUrl } = req.body;

    // Проверяем, существует ли указанный курс
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }

    // Создаем новый модуль
    const module = await Module.create({ title, content, courseId, videoUrl, materialsUrl });

    res.status(201).json({ message: "Модуль успешно создан", module });
  } catch (error) {
    console.error("❌ Ошибка при создании модуля:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};


// 📌 Редактирование модуля (только для админа)
exports.updateModule = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const module = await Module.findByPk(req.params.id);
    if (!module) {
      return res.status(404).json({ message: "Модуль не найден" });
    }

    const { title, content } = req.body;
    module.title = title || module.title;
    module.content = content || module.content;
    await module.save();

    res.json({ message: "Модуль обновлен", module });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Удаление модуля (только для админа)
exports.deleteModule = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const module = await Module.findByPk(req.params.id);
    if (!module) {
      return res.status(404).json({ message: "Модуль не найден" });
    }

    await module.destroy();
    res.json({ message: "Модуль удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Завершение модуля пользователем
exports.completeModule = async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id);
    if (!module) {
      return res.status(404).json({ message: "Модуль не найден" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Проверяем, завершил ли пользователь уже этот модуль
    const completedModules = user.completedCourses || [];
    if (completedModules.includes(module.id)) {
      return res.status(400).json({ message: "Вы уже завершили этот модуль" });
    }

    // Добавляем модуль в список завершенных
    user.completedCourses = [...completedModules, module.id];
    await user.save();

    res.json({ message: "Модуль завершен", user });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};
