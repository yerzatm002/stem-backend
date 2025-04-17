const express = require("express");
const { generateCertificate, getCertificateById, validateCertificate, getUserCertificates, getCertificates  } = require("../controllers/certificateController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Управление сертификатами
router.post("/generate", authMiddleware, generateCertificate);
router.get("/:id", authMiddleware, getCertificateById);
router.get("/", authMiddleware, getCertificates);
router.get("/validate/:qrCode", validateCertificate);
router.get("/user/:userId", getUserCertificates);

module.exports = router;
