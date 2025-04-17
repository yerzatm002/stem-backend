const { Webinar, User, WebinarRegistration } = require("../models");

// 📌 Получение списка вебинаров
exports.getAllWebinars = async (req, res) => {
  try {
    // 📌 Загружаем вебинары без инструктора
    const webinars = await Webinar.findAll({
      order: [["date", "ASC"]],
    });

    // 📌 Собираем все `instructorId` для загрузки пользователей
    const instructorIds = webinars.map((w) => w.instructorId);
    const instructors = await User.findAll({
      where: { id: instructorIds },
      attributes: ["id", "name", "email"],
    });

    // 📌 Преобразуем массив пользователей в объект `id -> userData`
    const instructorMap = instructors.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    // 📌 Добавляем инструктора к каждому вебинару
    const webinarsWithInstructors = webinars.map((webinar) => ({
      ...webinar.toJSON(),
      instructor: instructorMap[webinar.instructorId] || null,
    }));

    res.json(webinarsWithInstructors);
  } catch (error) {
    console.error("❌ Ошибка при получении списка вебинаров:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Создание вебинара (только для админа)
exports.createWebinar = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const { title, description, date, link } = req.body;

    const webinar = await Webinar.create({
      title,
      description,
      date,
      link,
      instructorId: req.user.id, // ✅ Исправлено `hostId` → `instructorId`
    });

    res.status(201).json({ message: "Вебинар создан", webinar });
  } catch (error) {
    console.error("❌ Ошибка при создании вебинара:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Получение информации о вебинаре
exports.getWebinarById = async (req, res) => {
  try {
    // 📌 Ищем вебинар без инструктора
    const webinar = await Webinar.findByPk(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: "Вебинар не найден" });
    }

    // 📌 Загружаем инструктора по `instructorId`
    const instructor = await User.findByPk(webinar.instructorId, {
      attributes: ["id", "name", "email"],
    });

    res.json({
      ...webinar.toJSON(),
      instructor: instructor || null, // Если не найден, передаем `null`
    });
  } catch (error) {
    console.error("❌ Ошибка при получении вебинара:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Запись пользователя на вебинар через `WebinarRegistration`
exports.registerForWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findByPk(req.params.id);
    if (!webinar) {
      return res.status(404).json({ message: "Вебинар не найден" });
    }

    // Проверяем, записан ли уже пользователь
    const existingRegistration = await WebinarRegistration.findOne({
      where: { userId: req.user.id, webinarId: webinar.id },
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "Вы уже записаны на этот вебинар" });
    }

    // Добавляем запись
    await WebinarRegistration.create({
      userId: req.user.id,
      webinarId: webinar.id,
    });

    res.json({ message: "Вы успешно записаны на вебинар" });
  } catch (error) {
    console.error("❌ Ошибка при регистрации на вебинар:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

exports.deleteWebinar = async (req, res) => {
  try {
    const { id } = req.params;

    const webinar = await Webinar.findByPk(id);
    if (!webinar) {
      return res.status(404).json({ message: "Вебинар не найден" });
    }

    await webinar.destroy();
    res.json({ message: "Вебинар успешно удален" });
  } catch (error) {
    console.error("❌ Ошибка при удалении вебинара:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

exports.getWebinarParticipants = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем, существует ли вебинар
    const webinar = await Webinar.findByPk(id);
    if (!webinar) {
      return res.status(404).json({ message: "Вебинар не найден" });
    }

    // Получаем список ID пользователей, зарегистрированных на вебинар
    const registrations = await WebinarRegistration.findAll({
      where: { webinarId: id },
      attributes: ["userId"], // Только ID пользователей
    });

    // Извлекаем userId в массив
    const userIds = registrations.map((reg) => reg.userId);

    if (userIds.length === 0) {
      return res.json({ webinarId: id, participants: [] }); // Если нет участников
    }

    // Получаем пользователей по их ID
    const participants = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "name", "email"], // Данные пользователя
    });

    res.json({ webinarId: id, participants });
  } catch (error) {
    console.error("❌ Ошибка при получении участников вебинара:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

