const express = require("express");
const {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getUserCourses,
  getCourseModules,
  getCourseTests
} = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 CRUD курсов
router.get("/", getAllCourses);
router.post("/", authMiddleware, createCourse); // Только админ
router.get("/:id", getCourseById);
router.get("/:id/modules", getCourseModules);
router.get("/:id/tests", getCourseTests);
router.put("/:id", authMiddleware, updateCourse); // Только админ
router.delete("/:id", authMiddleware, deleteCourse); // Только админ

// 📌 Запись на курс и список курсов пользователя
router.post("/:id/enroll", authMiddleware, enrollInCourse);
router.get("/users/:id/courses", authMiddleware, getUserCourses);

module.exports = router;
