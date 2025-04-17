const express = require("express");
const { getAllTopics, createTopic, getTopicById, addComment, deleteForumTopic, deleteForumComment  } = require("../controllers/forumController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Управление форумом
router.get("/", authMiddleware, getAllTopics);
router.post("/", authMiddleware, createTopic);
router.get("/:id", getTopicById);
router.post("/:id/comment", authMiddleware, addComment);
router.delete("/:id", deleteForumTopic);
router.delete("/:id/comment/:commentId", deleteForumTopic);

module.exports = router;
