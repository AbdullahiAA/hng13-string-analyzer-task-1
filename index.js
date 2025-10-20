const express = require("express");
const app = express();

// Configuration
const { PORT } = require("./config/constants");

// Middlewares
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

// Routes
const stringsRoutes = require("./routes/stringsRoutes");

// Apply middlewares
app.use(express.json());

// Mount routes
app.use("/strings", stringsRoutes);

// Error handling (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
