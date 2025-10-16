const express = require("express");
const app = express();

// Configuration
const { PORT } = require("./config/constants");

// Middlewares
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

// Routes
const profileRoutes = require("./routes/profileRoutes");

// Apply middlewares
app.use(express.json());

// Mount routes
app.use("/", profileRoutes);

// Error handling (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
