const express = require("express");
const {
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  completeModule,
} = require("../controllers/moduleController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 CRUD модулей
router.get("/:id", getModuleById);
router.post("/", authMiddleware, createModule); // Только админ
router.put("/:id", authMiddleware, updateModule); // Только админ
router.delete("/:id", authMiddleware, deleteModule); // Только админ

// 📌 Завершение модуля пользователем
router.post("/:id/complete", authMiddleware, completeModule);

module.exports = router;
