const express = require("express");
const { register, login, loginWithGoogle, logout, getMe, resetPassword, changePassword, updateProfile } = require("../controllers/authController");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Аутентификация
router.post("/register", [body("email").isEmail(), body("password").isLength({ min: 6 })], register);
router.post("/login", login);
router.post("/login/google", loginWithGoogle);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);
router.patch("/update-profile", authMiddleware, updateProfile);

// 📌 Управление паролем
router.post("/password/reset", resetPassword);
router.post("/password/change", authMiddleware, changePassword);

module.exports = router;
