const { Certificate, User, Course } = require("../models");
const qr = require("qr-image");
const fs = require("fs");
const path = require("path");

// 📌 Генерация сертификата
exports.generateCertificate = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findByPk(userId);
    const course = await Course.findByPk(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: "Пользователь или курс не найдены" });
    }

    // Создаем уникальный путь к сертификату
    const certificatePath = `/uploads/certificates/${user.id}_${course.id}.pdf`;
    const qrCodePath = `/uploads/certificates/${user.id}_${course.id}.png`;

    // Генерируем QR-код для проверки сертификата
    const qrCode = qr.image(`https://yourwebsite.com/api/certificates/validate/${user.id}_${course.id}`, { type: "png" });
    const qrCodeFilePath = path.join(__dirname, "..", "..", qrCodePath);
    qrCode.pipe(fs.createWriteStream(qrCodeFilePath));

    // Создаем запись в базе
    const certificate = await Certificate.create({
      userId,
      courseId,
      certificateUrl: certificatePath,
    });

    res.status(201).json({ message: "Сертификат сгенерирован", certificate });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

exports.getCertificateById = async (req, res) => {
  try {
    // 📌 Получаем ID сертификата из параметров
    const { id } = req.params;

    // 📌 Ищем сертификат по ID
    const certificate = await Certificate.findByPk(id);

    if (!certificate) {
      return res.status(404).json({ message: "Сертификат не найден" });
    }

    // 📌 Проверяем токен пользователя
    if (req.user.id !== certificate.userId) {
      return res.status(403).json({ message: "Нет доступа к этому сертификату" });
    }

    // 📌 Загружаем пользователя по userId из сертификата
    const user = await User.findByPk(certificate.userId, {
      attributes: ["id", "name", "email"],
    });

    // 📌 Загружаем курс по courseId из сертификата
    const course = await Course.findByPk(certificate.courseId, {
      attributes: ["id", "title", "description"],
    });

    res.json({
      id: certificate.id,
      certificateUrl: certificate.certificateUrl,
      createdAt: certificate.createdAt,
      user,
      course,
    });
  } catch (error) {
    console.error("❌ Ошибка при получении сертификата:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.findAll();
    res.json(certificates);
  } catch (error) {
    console.error("❌ Ошибка при получении сертификата:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};



// 📌 Проверка сертификата по QR-коду
exports.validateCertificate = async (req, res) => {
  try {
    const { qrCode } = req.params;

    const certificate = await Certificate.findOne({
      where: { id: qrCode },
    });

    if (!certificate) {
      return res.status(404).json({ message: "Сертификат не найден или недействителен" });
    }

    res.json({ message: "Сертификат действителен", certificate });
  } catch (error) {
    console.error("❌ Ошибка при проверке сертификата:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};


// 📌 Получение всех сертификатов пользователя по его ID
exports.getUserCertificates = async (req, res) => {
  try {
    const { userId } = req.params;

    // Проверяем, существует ли пользователь
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Получаем все сертификаты пользователя
    const certificates = await Certificate.findAll({
      where: { userId },
      include: {
        model: Course,
        attributes: ["id", "title"], // Добавляем название курса для удобства
      },
      order: [["createdAt", "DESC"]], // Сортируем по дате создания
    });

    res.json(certificates);
  } catch (error) {
    console.error("❌ Ошибка при получении сертификатов пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};