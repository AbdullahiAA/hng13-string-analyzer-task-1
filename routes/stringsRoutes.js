const express = require("express");
const router = express.Router();
const StringsController = require("../controllers/stringsController");

// POST / - Analyze string
router.post("/", StringsController.analyzeString);

router.get("/:value", StringsController.getSpecificString);

module.exports = router;
