const fs = require("fs");
const path = require("path");
const { isPalindrome, createSha256Hash } = require("../utils");
let stringsDb = require("../db/strings");

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
      value = value.trim().toLowerCase();

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

      return res.status(201).json(data);
    } catch (error) {
      console.error("Error:", error?.message);

      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error?.message,
      });
    }
  }

  static async getAllStrings(req, res) {
    try {
      const {
        is_palindrome,
        min_length,
        max_length,
        word_count,
        contains_character,
      } = req.query;

      // Validate and parse query parameters
      let isPalindromeFilter = null;
      let minLengthFilter = null;
      let maxLengthFilter = null;
      let wordCountFilter = null;
      let containsCharFilter = null;

      // Validate is_palindrome
      if (is_palindrome !== undefined) {
        if (is_palindrome !== "true" && is_palindrome !== "false") {
          return res.status(400).json({
            status: "error",
            message:
              "Invalid query parameter: is_palindrome must be 'true' or 'false'",
          });
        }
        isPalindromeFilter = is_palindrome === "true";
      }

      // Validate min_length
      if (min_length !== undefined) {
        minLengthFilter = parseInt(min_length, 10);
        if (isNaN(minLengthFilter) || minLengthFilter < 0) {
          return res.status(400).json({
            status: "error",
            message:
              "Invalid query parameter: min_length must be a non-negative integer",
          });
        }
      }

      // Validate max_length
      if (max_length !== undefined) {
        maxLengthFilter = parseInt(max_length, 10);
        if (isNaN(maxLengthFilter) || maxLengthFilter < 0) {
          return res.status(400).json({
            status: "error",
            message:
              "Invalid query parameter: max_length must be a non-negative integer",
          });
        }
      }

      // Validate word_count
      if (word_count !== undefined) {
        wordCountFilter = parseInt(word_count, 10);
        if (isNaN(wordCountFilter) || wordCountFilter < 0) {
          return res.status(400).json({
            status: "error",
            message:
              "Invalid query parameter: word_count must be a non-negative integer",
          });
        }
      }

      // Validate contains_character
      if (contains_character !== undefined) {
        if (
          typeof contains_character !== "string" ||
          contains_character.length !== 1
        ) {
          return res.status(400).json({
            status: "error",
            message:
              "Invalid query parameter: contains_character must be a single character",
          });
        }
        containsCharFilter = contains_character;
      }

      // Filter strings based on provided parameters
      const filteredStrings = stringsDb.filter((entry) => {
        // Check is_palindrome filter
        if (
          isPalindromeFilter !== null &&
          entry.properties.is_palindrome !== isPalindromeFilter
        ) {
          return false;
        }

        // Check min_length filter
        if (
          minLengthFilter !== null &&
          entry.properties.length < minLengthFilter
        ) {
          return false;
        }

        // Check max_length filter
        if (
          maxLengthFilter !== null &&
          entry.properties.length > maxLengthFilter
        ) {
          return false;
        }

        // Check word_count filter
        if (
          wordCountFilter !== null &&
          entry.properties.word_count !== wordCountFilter
        ) {
          return false;
        }

        // Check contains_character filter
        if (containsCharFilter !== null) {
          if (!entry.properties.character_frequency_map[containsCharFilter]) {
            return false;
          }
        }

        return true;
      });

      const response = {
        data: filteredStrings,
        count: filteredStrings.length,
        filters_applied: {
          is_palindrome: isPalindromeFilter,
          min_length: minLengthFilter,
          max_length: maxLengthFilter,
          word_count: wordCountFilter,
          contains_character: containsCharFilter,
        },
      };

      return res.status(200).json(response);
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
      value = value.trim().toLowerCase();
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

  static async deleteSpecificString(req, res) {
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

      value = value.trim().toLowerCase();

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

      // Remove the entry from the database
      stringsDb = stringsDb.filter((entry) => entry.id !== sha256_hash);

      // Persist to file
      const dbPath = path.join(__dirname, "..", "db", "strings.js");
      const dbContent = `module.exports = ${JSON.stringify(
        stringsDb,
        null,
        2
      )};`;

      fs.writeFileSync(dbPath, dbContent, "utf8");

      return res.status(204).json({});
    } catch (error) {
      console.error("Error:", error?.message);

      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: error?.message,
      });
    }
  }

  static async filterByNaturalLanguage(req, res) {
    try {
      let query = req.query?.query;

      if (!query) {
        return res.status(400).json({
          status: "error",
          message: "Query is required",
        });
      }

      if (typeof query !== "string") {
        return res.status(422).json({
          status: "error",
          message: "Query must be a string",
        });
      }

      // Trim the query
      query = query.trim().toLowerCase();

      // Initialize parsed filters
      const parsedFilters = {};

      // Parse for palindrome
      if (
        query.includes("palindrome") ||
        query.includes("palindromic") ||
        query.includes("reads the same backwards")
      ) {
        parsedFilters.is_palindrome = true;
      }

      // Parse for word count
      if (query.includes("single word")) {
        parsedFilters.word_count = 1;
      } else if (query.includes("two word") || query.includes("2 word")) {
        parsedFilters.word_count = 2;
      } else if (query.includes("three word") || query.includes("3 word")) {
        parsedFilters.word_count = 3;
      } else if (query.includes("four word") || query.includes("4 word")) {
        parsedFilters.word_count = 4;
      } else if (query.includes("five word") || query.includes("5 word")) {
        parsedFilters.word_count = 5;
      }

      // Parse for min_length
      const longerThanMatch = query.match(
        /longer than (\d+)|more than (\d+) character/i
      );
      if (longerThanMatch) {
        const length = parseInt(longerThanMatch[1] || longerThanMatch[2], 10);
        parsedFilters.min_length = length + 1;
      }

      const atLeastMatch = query.match(/at least (\d+) character/i);
      if (atLeastMatch) {
        parsedFilters.min_length = parseInt(atLeastMatch[1], 10);
      }

      // Parse for max_length
      const shorterThanMatch = query.match(
        /shorter than (\d+)|less than (\d+) character/i
      );
      if (shorterThanMatch) {
        const length = parseInt(shorterThanMatch[1] || shorterThanMatch[2], 10);
        parsedFilters.max_length = length - 1;
      }

      const atMostMatch = query.match(/at most (\d+) character/i);
      if (atMostMatch) {
        parsedFilters.max_length = parseInt(atMostMatch[1], 10);
      }

      // Parse for contains_character
      // Handle "first vowel" or specific vowels
      if (query.includes("first vowel")) {
        parsedFilters.contains_character = "a";
      } else if (query.includes("second vowel")) {
        parsedFilters.contains_character = "e";
      } else if (query.includes("third vowel")) {
        parsedFilters.contains_character = "i";
      } else if (query.includes("fourth vowel")) {
        parsedFilters.contains_character = "o";
      } else if (
        query.includes("fifth vowel") ||
        query.includes("last vowel")
      ) {
        parsedFilters.contains_character = "u";
      }

      // Handle "containing the letter X" or "contains the letter X"
      const letterMatch = query.match(
        /contain(?:ing|s)? (?:the )?letter ([a-z])/i
      );
      if (letterMatch) {
        parsedFilters.contains_character = letterMatch[1].toLowerCase();
      }

      // Handle "with the character X" or "that have X"
      const charMatch = query.match(/with (?:the )?character ([a-z])/i);
      if (charMatch) {
        parsedFilters.contains_character = charMatch[1].toLowerCase();
      }

      // Check if we parsed anything
      if (Object.keys(parsedFilters).length === 0) {
        return res.status(400).json({
          status: "error",
          message: "Unable to parse natural language query",
        });
      }

      // Check for conflicting filters
      if (
        parsedFilters.min_length !== undefined &&
        parsedFilters.max_length !== undefined &&
        parsedFilters.min_length > parsedFilters.max_length
      ) {
        return res.status(422).json({
          status: "error",
          message: "Query parsed but resulted in conflicting filters",
        });
      }

      // Apply filters
      const filteredStrings = stringsDb.filter((entry) => {
        // Check is_palindrome filter
        if (
          parsedFilters.is_palindrome !== undefined &&
          entry.properties.is_palindrome !== parsedFilters.is_palindrome
        ) {
          return false;
        }

        // Check min_length filter
        if (
          parsedFilters.min_length !== undefined &&
          entry.properties.length < parsedFilters.min_length
        ) {
          return false;
        }

        // Check max_length filter
        if (
          parsedFilters.max_length !== undefined &&
          entry.properties.length > parsedFilters.max_length
        ) {
          return false;
        }

        // Check word_count filter
        if (
          parsedFilters.word_count !== undefined &&
          entry.properties.word_count !== parsedFilters.word_count
        ) {
          return false;
        }

        // Check contains_character filter
        if (parsedFilters.contains_character !== undefined) {
          if (
            !entry.properties.character_frequency_map[
              parsedFilters.contains_character
            ]
          ) {
            return false;
          }
        }

        return true;
      });

      const response = {
        data: filteredStrings,
        count: filteredStrings.length,
        interpreted_query: {
          original: originalQuery,
          parsed_filters: parsedFilters,
        },
      };

      return res.status(200).json(response);
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
