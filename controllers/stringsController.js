const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { isPalindrome, createSha256Hash } = require("../utils");
const stringsDb = require("../db/strings");

class StringsController {
  static async analyzeString(req, res) {
    try {
      let value = req.body?.value;

      if (!value) {
        return res.status(400).json({
          status: "error",
          message: "Value is required",
        });
      }

      if (typeof value !== "string") {
        return res.status(422).json({
          status: "error",
          message: "Value must be a string",
        });
      }

      // Trim the value
      value = value.trim();

      const sha256_hash = createSha256Hash(value);

      // Check for conflict
      const existingEntry = (stringsDb || []).find(
        (entry) => entry.id === sha256_hash
      );
      if (existingEntry) {
        return res.status(409).json({
          status: "error",
          message: "String already exists",
          data: existingEntry,
        });
      }

      const data = {
        id: sha256_hash,
        value: value,
        properties: {
          length: value.length,
          is_palindrome: isPalindrome(value),
          unique_characters: new Set(value).size,
          word_count: value.split(" ").length,
          sha256_hash: sha256_hash,
          character_frequency_map: value.split("").reduce((acc, char) => {
            acc[char] = (acc[char] || 0) + 1;
            return acc;
          }, {}),
        },
        created_at: new Date().toISOString(),
      };

      // Save to in-memory database
      stringsDb.push(data);

      // Persist to file
      const dbPath = path.join(__dirname, "..", "db", "strings.js");
      const dbContent = `module.exports = ${JSON.stringify(
        stringsDb,
        null,
        2
      )};`;

      fs.writeFileSync(dbPath, dbContent, "utf8");

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error:", error?.message);

      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error?.message,
      });
    }
  }

  static async getSpecificString(req, res) {
    try {
      let value = req.params?.value;

      if (!value) {
        return res.status(400).json({
          status: "error",
          message: "Value is required",
        });
      }

      if (typeof value !== "string") {
        return res.status(422).json({
          status: "error",
          message: "Value must be a string",
        });
      }

      // Trim the value
      value = value.trim();
      const sha256_hash = createSha256Hash(value);

      const existingEntry = (stringsDb || []).find(
        (entry) => entry.id === sha256_hash
      );
      
      if (!existingEntry) {
        return res.status(404).json({
          status: "error",
          message: "String not found",
        });
      }

      return res.status(200).json(existingEntry);
    } catch (error) {
      console.error("Error:", error?.message);

      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error?.message,
      });
    }
  }
}

module.exports = StringsController;
