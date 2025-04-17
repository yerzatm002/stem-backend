const express = require("express");
const { chatWithGPT4All } = require("../controllers/chatController");

const router = express.Router();

// Chatbot Route
router.post("/", chatWithGPT4All);

module.exports = router;
