const express = require("express");
const router = express.Router();
const StringsController = require("../controllers/stringsController");

router.post("/", StringsController.analyzeString);

router.get("/", StringsController.getAllStrings);

router.get(
  "/filter-by-natural-language",
  StringsController.filterByNaturalLanguage
);

router.get("/:value", StringsController.getSpecificString);

router.delete("/:value", StringsController.deleteSpecificString);



module.exports = router;
