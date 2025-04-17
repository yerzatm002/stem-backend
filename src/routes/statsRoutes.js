const express = require("express");
const { getUserStats, getCourseStats, getTestStats } = require("../controllers/statsController");
const router = express.Router();

router.get("/users", getUserStats);
router.get("/courses", getCourseStats);
router.get("/tests", getTestStats);

module.exports = router;
