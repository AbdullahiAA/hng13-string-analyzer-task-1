const express = require("express");
const router = express.Router();
const StringsController = require("../controllers/stringsController");

router.post("/", StringsController.analyzeString);

router.get("/", StringsController.getAllStrings);

router.get("/:value", StringsController.getSpecificString);

module.exports = router;
