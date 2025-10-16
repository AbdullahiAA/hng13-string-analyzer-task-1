# HNG13 Profile Task - MVC Architecture

A Node.js/Express API following the MVC (Model-View-Controller) architectural pattern, providing a profile endpoint with dynamic cat facts.

## Project Structure

```
hng13-profile-task-0/
│
├── index.js                    # Application entry point
│
├── config/                     # Configuration files
│   └── constants.js           # Application constants
│
├── models/                     # Data models
│   └── User.js                # User model with business logic
│
├── controllers/                # Request handlers
│   └── profileController.js   # Profile endpoint controller
│
├── routes/                     # Route definitions
│   └── profileRoutes.js       # Profile routes
│
├── services/                   # Business logic & external APIs
│   └── catFactService.js      # Cat Facts API integration
│
├── middlewares/                # Custom middlewares
│   └── errorHandler.js        # Error handling middleware
│
└── package.json               # Dependencies
```

## MVC Architecture Explained

### Model (`models/`)

- **Purpose**: Represents data structures and business logic
- **Example**: `User.js` - Defines user data structure and methods to retrieve user information
- **Responsibilities**:
  - Define data structure
  - Data validation
  - Business logic related to data

### View (Response Format)

- **Purpose**: In REST APIs, the "view" is the JSON response format
- **Location**: Handled in controllers
- **Responsibilities**:
  - Structure the response data
  - Return appropriate content-type headers

### Controller (`controllers/`)

- **Purpose**: Handles incoming requests and coordinates between models and services
- **Example**: `ProfileController.js` - Orchestrates user data retrieval and cat fact fetching
- **Responsibilities**:
  - Process HTTP requests
  - Call appropriate services/models
  - Format and send responses
  - Handle errors

### Additional Layers

#### Routes (`routes/`)

- **Purpose**: Define API endpoints and map them to controllers
- **Benefits**: Separates routing logic from business logic

#### Services (`services/`)

- **Purpose**: Contains business logic and external API integrations
- **Example**: `CatFactService.js` - Handles Cat Facts API calls
- **Benefits**: Reusable code, easier testing, separation of concerns

#### Middlewares (`middlewares/`)

- **Purpose**: Functions that process requests before they reach controllers
- **Example**: Error handlers, authentication, logging
- **Benefits**: Code reusability, separation of cross-cutting concerns

## API Endpoints

### GET /me

Returns user profile information along with a random cat fact.

**Response Format:**

```json
{
  "status": "success",
  "user": {
    "email": "osuolaleabdullahi@gmail.com",
    "name": "Jelili Abdullahi A.",
    "stack": "Node.js/Express"
  },
  "timestamp": "2025-10-16T17:57:25.242Z",
  "fact": "Cats are amazing creatures!"
}
```

**Features:**

- ✅ Dynamic timestamp (updates with each request)
- ✅ Fresh cat fact on every request (from Cat Facts API)
- ✅ Graceful fallback if external API fails
- ✅ Proper error handling
- ✅ 5-second timeout for external API calls

## Installation & Usage

### Install Dependencies

```bash
yarn install
# or
npm install
```

### Start the Server

```bash
# Production
yarn start

# Development (with auto-reload)
yarn dev
```

### Test the Endpoint

```bash
curl http://localhost:3000/me
```

## Benefits of MVC Architecture

1. **Separation of Concerns**: Each component has a single, well-defined responsibility
2. **Maintainability**: Easier to locate and fix bugs
3. **Scalability**: Easy to add new features without affecting existing code
4. **Testability**: Each layer can be tested independently
5. **Code Reusability**: Services and models can be reused across different controllers
6. **Team Collaboration**: Multiple developers can work on different layers simultaneously

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for external API calls

## Author

**Jelili Abdullahi A.**

- Email: osuolaleabdullahi@gmail.com
- Stack: Node.js/Express
