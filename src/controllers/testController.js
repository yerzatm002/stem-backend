const { Test, TestResult, User, Module, Course } = require("../models");

// 📌 Получение теста по ID
exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Тест не найден" });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Начало теста (фиксируем старт)
exports.startTest = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Тест не найден" });
    }

    res.json({ message: "Тест начат", testId: test.id });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Тест табылмады" });
    }

    let { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Жауаптар массив түрінде болуы керек." });
    }

    // Получаем все вопросы из теста
    const correctAnswers = Array.isArray(test.questions) ? test.questions : [];

    if (correctAnswers.length === 0) {
      return res.status(500).json({ message: "Тесттің сұрақтары дұрыс емес форматта." });
    }

    let score = 0;
    let processedAnswers = [];

    answers.forEach(({ questionId, selectedAnswer }) => {
      // Проверяем, что `questionId` передан и является числом
      if (typeof questionId !== "number") {
        console.warn("⚠ Warning: Неверный формат questionId:", questionId);
        return;
      }

      // Ищем вопрос по `questionId`
      const questionData = correctAnswers.find((q, index) => index + 1 === questionId); // Исправлено для соответствия порядку вопросов

      if (questionData) {
        const correctAnswer = questionData.correctAnswer || "Жауап белгіленбеген";
        const questionText = questionData.question || "Белгісіз сұрақ";

        if (selectedAnswer === correctAnswer) {
          score += 1;
        }

        processedAnswers.push({
          questionId,
          question: questionText,
          userAnswer: selectedAnswer || "Жауап жоқ",
          correctAnswer,
        });
      }
    });

    console.log("📝 Обработанные ответы:", processedAnswers);

    // Подсчет финального процента
    const totalQuestions = correctAnswers.length;
    const finalScore = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    // Сохранение результата теста в БД
    const result = await TestResult.create({
      userId: req.user.id,
      testId: test.id,
      score: finalScore,
      answers: JSON.stringify(processedAnswers), // Сохраняем ответы в JSON
    });

    res.json({ message: "✅ Тест нәтижесі сақталды", result });
  } catch (error) {
    console.error("❌ Тестті тапсыру барысында қате:", error);
    res.status(500).json({ message: "Сервер қатесі", error });
  }
};

// 📌 Получение результатов теста
exports.getTestResults = async (req, res) => {
  try {
    const { id } = req.params; // testId from request
    const userId = req.user.id; // Assuming user is authenticated

    // Find the latest test result for the given test and user
    const latestResult = await TestResult.findOne({
      where: { testId: id, userId },
      order: [["createdAt", "DESC"]], // Sort by newest
    });

    if (!latestResult) {
      return res.status(404).json({ message: "Тест нәтижелері табылмады." });
    }

    res.json(latestResult);
  } catch (error) {
    console.error("❌ Тест нәтижелерін алу қатесі:", error);
    res.status(500).json({ message: "Сервер қатесі", error });
  }
};

// 📌 История тестов пользователя
exports.getUserTestHistory = async (req, res) => {
  try {
    const results = await TestResult.findAll({ where: { userId: req.params.userId } });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Создание нового теста (только для админа)
exports.createTest = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const { courseId, moduleId, questions } = req.body;

    // 🔹 Проверяем, существует ли курс
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }

    // 🔹 Проверяем, существует ли модуль
    const module = await Module.findByPk(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Модуль не найден" });
    }

    // 🔹 Проверяем, корректен ли формат вопросов
    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Поле 'questions' должно быть массивом" });
    }

    // 🔹 Назначаем уникальные questionId для каждого вопроса
    const formattedQuestions = questions.map((q, index) => ({
      questionId: index + 1, // Генерируем questionId начиная с 1
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    }));

    // 🔹 Создаем тест с правильно отформатированными вопросами
    const test = await Test.create({ courseId, moduleId, questions: formattedQuestions });

    res.status(201).json({ message: "Тест успешно создан", test });
  } catch (error) {
    console.error("❌ Ошибка при создании теста:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};



exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.findAll({
      include: [
        {
          model: Course,
          attributes: ["id", "title"], // Получаем только ID и название курса
        },
        {
          model: Module,
          attributes: ["id", "title"], // Получаем только ID и название модуля
        },
      ],
    });

    res.json(tests);
  } catch (error) {
    console.error("❌ Ошибка при получении тестов:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};


// 📌 Обновление теста (только для админа)
exports.updateTest = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const { id } = req.params;
    const { title, courseId, moduleId, questions } = req.body;

    // 🔹 Проверяем, существует ли тест
    const test = await Test.findByPk(id);
    if (!test) {
      return res.status(404).json({ message: "Тест не найден" });
    }

    // 🔹 Проверяем, существует ли курс
    if (courseId) {
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({ message: "Курс не найден" });
      }
    }

    // 🔹 Проверяем, существует ли модуль
    if (moduleId) {
      const module = await Module.findByPk(moduleId);
      if (!module) {
        return res.status(404).json({ message: "Модуль не найден" });
      }
    }

    // 🔹 Проверяем, корректен ли формат вопросов
    if (questions && !Array.isArray(questions)) {
      return res.status(400).json({ message: "Поле 'questions' должно быть массивом" });
    }

    // 🔹 Обновляем вопросы теста, сохраняя старые questionId
    let existingQuestions = Array.isArray(test.questions) ? test.questions : [];

    // Если есть новые вопросы, добавляем их с уникальными questionId
    const formattedQuestions = questions.map((q, index) => {
      const existingQuestion = existingQuestions.find((exQ) => exQ.questionId === q.questionId);
      return existingQuestion
        ? { ...existingQuestion, question: q.question, options: q.options, correctAnswer: q.correctAnswer }
        : { questionId: existingQuestions.length + index + 1, ...q };
    });

    // 🔹 Обновляем тест
    test.title = title || test.title;
    test.courseId = courseId || test.courseId;
    test.moduleId = moduleId || test.moduleId;
    test.questions = formattedQuestions;

    await test.save();

    res.json({ message: "Тест успешно обновлен", test });
  } catch (error) {
    console.error("❌ Ошибка при обновлении теста:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};
