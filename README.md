# String Analyzer API

A powerful Node.js/Express REST API that analyzes strings and provides comprehensive text analysis including palindrome detection, character frequency mapping, and advanced filtering capabilities with natural language query support.

## Features

- 🔍 **String Analysis** - Analyzes strings and extracts detailed properties
- 🔐 **SHA-256 Hashing** - Generates unique identifiers for each string
- 🔄 **Palindrome Detection** - Identifies palindromic strings
- 📊 **Character Frequency** - Maps character occurrences in strings
- 🗄️ **Persistent Storage** - Stores analyzed strings in a file-based database
- 🔎 **Advanced Filtering** - Filter strings by multiple criteria
- 💬 **Natural Language Queries** - Query strings using human-readable language
- ⚡ **Fast & Efficient** - Built with Express.js for optimal performance

## Project Structure

```
hng13-string-analyzer-task-1/
│
├── index.js                    # Application entry point
│
├── config/                     # Configuration files
│   └── constants.js           # Application constants
│
├── controllers/                # Request handlers
│   └── stringsController.js   # String operations controller
│
├── routes/                     # Route definitions
│   └── stringsRoutes.js       # String routes
│
├── middlewares/                # Custom middlewares
│   └── errorHandler.js        # Error handling middleware
│
├── utils/                      # Utility functions
│   └── index.js               # Helper functions
│
├── db/                         # Database files
│   └── strings.js             # String storage
│
└── package.json               # Dependencies
```

## API Endpoints

### 1. Analyze String

Analyzes a string and stores it in the database with comprehensive properties.

**Endpoint:** `POST /strings`

**Request Body:**

```json
{
  "value": "Mr Owl ate my metal worm"
}
```

**Success Response (201 Created):**

```json
{
  "id": "9f84bbb584388ee15e6667b1e03b339db3bc0b95591418eac41b2fc7bfef704d",
  "value": "Mr Owl ate my metal worm",
  "properties": {
    "length": 24,
    "is_palindrome": true,
    "unique_characters": 12,
    "word_count": 6,
    "sha256_hash": "9f84bbb584388ee15e6667b1e03b339db3bc0b95591418eac41b2fc7bfef704d",
    "character_frequency_map": {
      "M": 1,
      "r": 2,
      " ": 5,
      "O": 1,
      "w": 2,
      "l": 2,
      "a": 2,
      "t": 2,
      "e": 2,
      "m": 3,
      "y": 1,
      "o": 1
    }
  },
  "created_at": "2025-10-20T16:56:04.443Z"
}
```

**Error Responses:**

- `400 Bad Request` - Value is required
- `422 Unprocessable Entity` - Value must be a string
- `409 Conflict` - String already exists
- `500 Internal Server Error` - Server error

---

### 2. Get Specific String

Retrieves a previously analyzed string by its value.

**Endpoint:** `GET /strings/:value`

**Example:** `GET /strings/Police`

**Success Response (200 OK):**

```json
{
  "id": "2efeeeb01318ac942d6a2624ab92358a969937c33ea86ed8416e906ac272529c",
  "value": "Police",
  "properties": {
    "length": 6,
    "is_palindrome": false,
    "unique_characters": 6,
    "word_count": 1,
    "sha256_hash": "2efeeeb01318ac942d6a2624ab92358a969937c33ea86ed8416e906ac272529c",
    "character_frequency_map": {
      "P": 1,
      "o": 1,
      "l": 1,
      "i": 1,
      "c": 1,
      "e": 1
    }
  },
  "created_at": "2025-10-20T17:05:43.957Z"
}
```

**Error Responses:**

- `400 Bad Request` - Value is required
- `404 Not Found` - String not found
- `422 Unprocessable Entity` - Value must be a string
- `500 Internal Server Error` - Server error

---

### 3. Get All Strings with Filtering

Retrieves all strings with optional filtering parameters.

**Endpoint:** `GET /strings`

**Query Parameters:**

- `is_palindrome` - boolean (true/false)
- `min_length` - integer (minimum string length)
- `max_length` - integer (maximum string length)
- `word_count` - integer (exact word count)
- `contains_character` - string (single character to search for)

**Example:** `GET /strings?is_palindrome=true&min_length=5&max_length=20&word_count=2`

**Success Response (200 OK):**

```json
{
  "data": [
    {
      "id": "hash1",
      "value": "string1",
      "properties": {
        /* ... */
      },
      "created_at": "2025-08-27T10:00:00Z"
    }
  ],
  "count": 15,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "max_length": 20,
    "word_count": 2,
    "contains_character": null
  }
}
```

**Error Response:**

- `400 Bad Request` - Invalid query parameter values or types
- `500 Internal Server Error` - Server error

---

### 4. Natural Language Filtering

Filter strings using natural language queries instead of structured parameters.

**Endpoint:** `GET /strings/filter-by-natural-language`

**Query Parameter:**

- `query` - string (natural language query)

**Supported Query Patterns:**

| Query Example                                      | Parsed Filters                               |
| -------------------------------------------------- | -------------------------------------------- |
| "all single word palindromic strings"              | `word_count=1`, `is_palindrome=true`         |
| "strings longer than 10 characters"                | `min_length=11`                              |
| "palindromic strings that contain the first vowel" | `is_palindrome=true`, `contains_character=a` |
| "strings containing the letter z"                  | `contains_character=z`                       |
| "two word strings"                                 | `word_count=2`                               |
| "strings shorter than 5 characters"                | `max_length=4`                               |

**Example:** `GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings`

**Success Response (200 OK):**

```json
{
  "data": [
    {
      "id": "hash1",
      "value": "noon",
      "properties": {
        /* ... */
      },
      "created_at": "2025-08-27T10:00:00Z"
    }
  ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

**Error Responses:**

- `400 Bad Request` - Query is required or unable to parse natural language query
- `422 Unprocessable Entity` - Query must be a string or conflicting filters detected
- `500 Internal Server Error` - Server error

---

### 5. Delete Specific String

Deletes a previously analyzed string from the database.

**Endpoint:** `DELETE /strings/:value`

**Example:** `DELETE /strings/Police`

**Success Response (204 No Content)**

**Error Responses:**

- `400 Bad Request` - Value is required
- `404 Not Found` - String not found
- `422 Unprocessable Entity` - Value must be a string
- `500 Internal Server Error` - Server error

---

## String Properties Explained

When a string is analyzed, the following properties are extracted:

- **`id`** - SHA-256 hash of the string (unique identifier)
- **`value`** - The original string
- **`properties.length`** - Total character count (including spaces)
- **`properties.is_palindrome`** - Boolean indicating if the string reads the same forwards and backwards (case-insensitive, ignoring spaces)
- **`properties.unique_characters`** - Count of unique characters in the string
- **`properties.word_count`** - Number of words (split by spaces)
- **`properties.sha256_hash`** - SHA-256 hash of the string
- **`properties.character_frequency_map`** - Object mapping each character to its occurrence count
- **`created_at`** - ISO 8601 timestamp of when the string was analyzed

## Installation & Usage

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Install Dependencies

```bash
npm install
```

### Start the Server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

The server will start on `http://localhost:3000`

### Test the Endpoints

```bash
# Analyze a string
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"Hello World"}'

# Get all strings
curl http://localhost:3000/strings

# Filter strings
curl "http://localhost:3000/strings?is_palindrome=true"

# Natural language query
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20palindromic%20strings"

# Get specific string
curl http://localhost:3000/strings/Hello%20World

# Delete a string
curl -X DELETE http://localhost:3000/strings/Hello%20World
```

## Natural Language Query Guide

The natural language filtering endpoint supports various query patterns:

### Palindrome Queries

- "palindrome", "palindromic", "reads the same backwards"

### Word Count Queries

- "single word", "two word", "three word", etc.

### Length Queries

- "longer than X", "more than X characters", "at least X characters"
- "shorter than X", "less than X characters", "at most X characters"

### Character Queries

- "containing the letter X", "contains letter X"
- "first vowel" (a), "second vowel" (e), "third vowel" (i), "fourth vowel" (o), "fifth vowel" (u)
- "with the character X"

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **crypto** - Built-in Node.js module for SHA-256 hashing
- **fs** - File system operations for database persistence

## Architecture

This API follows the **MVC (Model-View-Controller)** architectural pattern:

- **Models**: Define data structures and business logic
- **Views**: JSON response formats
- **Controllers**: Handle requests and coordinate between models and services
- **Routes**: Define API endpoints and map them to controllers
- **Utils**: Helper functions for string analysis and hashing
- **Middlewares**: Error handling and request processing

### Benefits

1. **Separation of Concerns** - Each component has a clear responsibility
2. **Maintainability** - Easy to locate and fix bugs
3. **Scalability** - Simple to add new features
4. **Testability** - Each layer can be tested independently
5. **Code Reusability** - Utils and services are reusable

## Error Handling

All endpoints include comprehensive error handling:

- **400 Bad Request** - Missing or invalid required parameters
- **404 Not Found** - Resource doesn't exist
- **409 Conflict** - Resource already exists
- **422 Unprocessable Entity** - Invalid data type or conflicting filters
- **500 Internal Server Error** - Unexpected server errors

## Database

The API uses a simple file-based database (`db/strings.js`) that stores analyzed strings as a JavaScript array. Each string entry is persisted to disk after analysis or deletion.

### Database Format

```javascript
module.exports = [
  {
    id: "hash...",
    value: "string value",
    properties: {
      /* ... */
    },
    created_at: "2025-10-20T17:05:43.957Z",
  },
];
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

**Jelili Abdullahi A.**

- Email: osuolaleabdullahi@gmail.com
- Stack: Node.js/Express

## License

This project is open source and available under the MIT License.
