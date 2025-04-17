const express = require("express");
const {
  getTestById,
  startTest,
  submitTest,
  getTestResults,
  getUserTestHistory,
  createTest,
  getAllTests,
  updateTest 
} = require("../controllers/testController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllTests);
router.get("/:id", authMiddleware, getTestById);
router.post("/:id/start", authMiddleware, startTest);
router.post("/:id/submit", authMiddleware, submitTest);
router.get("/:id/results", authMiddleware, getTestResults);
router.get("/history/:userId", authMiddleware, getUserTestHistory);
router.post("/", authMiddleware, createTest);
router.put("/:id", authMiddleware, updateTest);

module.exports = router;
