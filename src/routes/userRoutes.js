const express = require("express");
const { getUser, updateUser, deleteUser, getAllUsers } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Управление пользователями
router.get("/:id", authMiddleware, getUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.get("/", authMiddleware, getAllUsers); // Только для админа

module.exports = router;
