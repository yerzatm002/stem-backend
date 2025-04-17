const { Course, User, Module, Test } = require("../models");

// 📌 Получение списка всех курсов
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: { model: User, as: "instructor", attributes: ["id", "name", "email"] },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Создание нового курса (только для админа)
exports.createCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const { title, description, image } = req.body;
    const course = await Course.create({ title, description, image, instructorId: req.user.id });

    res.status(201).json({ message: "Курс создан", course });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Получение информации о курсе
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: { model: User, as: "instructor", attributes: ["id", "name", "email"] },
    });

    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Редактирование курса (только для админа)
exports.updateCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }

    const { title, description, image } = req.body;
    course.title = title || course.title;
    course.description = description || course.description;
    course.image = image || course.image;
    await course.save();

    res.json({ message: "Курс обновлен", course });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Удаление курса (только для админа)
exports.deleteCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }

    await course.destroy();
    res.json({ message: "Курс удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Запись пользователя на курс
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Проверяем, записан ли уже пользователь на курс
    const completedCourses = user.completedCourses || [];
    if (completedCourses.includes(course.id)) {
      return res.status(400).json({ message: "Вы уже записаны на этот курс" });
    }

    // Добавляем курс в список записанных
    user.completedCourses = [...completedCourses, course.id];
    await user.save();

    res.json({ message: "Вы успешно записаны на курс", user });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Получение списка курсов пользователя
exports.getUserCourses = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "completedCourses"],
    });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const courses = await Course.findAll({
      where: { id: user.completedCourses },
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

exports.getCourseModules = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем, существует ли курс
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }

    // Получаем все модули, связанные с этим курсом
    const modules = await Module.findAll({
      where: { courseId: id },
      order: [["createdAt", "ASC"]],
    });

    res.json({ courseId: id, modules });
  } catch (error) {
    console.error("❌ Ошибка при получении модулей курса:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Получение всех тестов по курсу
exports.getCourseTests = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем, существует ли курс
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }

    // Ищем все тесты, связанные с данным курсом
    const tests = await Test.findAll({ where: { courseId: id }, include: [
      {
        model: Course,
        attributes: ["id", "title"], 
      },
      {
        model: Module,
        attributes: ["id", "title"],
      },
    ], });

    res.json({ courseId: id, tests });
  } catch (error) {
    console.error("❌ Ошибка при получении тестов по курсу:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};