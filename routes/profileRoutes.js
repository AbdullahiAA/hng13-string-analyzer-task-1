const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/profileController");

// GET /me - Get user profile with cat fact
router.get("/me", ProfileController.getProfile);

module.exports = router;
