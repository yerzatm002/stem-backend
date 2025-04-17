const { User, Course, Test, TestResult } = require("../models");
const { Op } = require("sequelize");


// 📌 Получение аналитики по пользователям
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({
      where: { lastLoginAt: { [Op.ne]: null } }, // ✅ Проверяем активных пользователей
    });

    res.json({ totalUsers, activeUsers });
  } catch (error) {
    console.error("❌ Ошибка при получении статистики пользователей:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Получение аналитики по курсам
exports.getCourseStats = async (req, res) => {
  try {
    const totalCourses = await Course.count();
    const mostPopularCourse = await Course.findOne({
      order: [["enrolledUsers", "DESC"]], // ✅ Используем `enrolledUsers`
      attributes: ["id", "title", "enrolledUsers"],
    });

    res.json({ totalCourses, mostPopularCourse });
  } catch (error) {
    console.error("❌ Ошибка при получении статистики курсов:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// 📌 Получение аналитики по тестам
exports.getTestStats = async (req, res) => {
  try {
    const totalTests = await Test.count();
    const totalAttempts = await TestResult.count();
    const averageScore = await TestResult.findOne({
      attributes: [[TestResult.sequelize.fn("AVG", TestResult.sequelize.col("score")), "avgScore"]],
    });

    res.json({
      totalTests,
      totalAttempts,
      averageScore: averageScore ? parseFloat(averageScore.dataValues.avgScore).toFixed(2) : "0.00",
    });
  } catch (error) {
    console.error("❌ Ошибка при получении статистики тестов:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};
