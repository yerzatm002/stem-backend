const express = require("express");
const {
  getAllWebinars,
  createWebinar,
  getWebinarById,
  registerForWebinar,
  deleteWebinar,
  getWebinarParticipants 
} = require("../controllers/webinarController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Управление вебинарами
router.get("/", getAllWebinars);
router.post("/", authMiddleware, createWebinar); // Только админ
router.get("/:id", getWebinarById);
router.post("/:id/register", authMiddleware, registerForWebinar);
router.delete("/:id", deleteWebinar);
router.get("/:id/participants", getWebinarParticipants );

module.exports = router;
