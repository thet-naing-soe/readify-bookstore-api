require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const logger = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const {
  swaggerUi,
  swaggerDocument,
  swaggerOptions,
} = require("./config/swagger");

const app = express();

// Middleware Setup
// JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logging
app.use(
  morgan("combined", {
    stream: {
      write: (message) => {
        logger.http(message.trim());
      },
    },
  }),
);

// API Documentation (Swagger UI)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions),
);

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "Readify Bookstore API",
    version: process.env.npm_package_version || "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
  });
});

// API Routes
const API_PREFIX = process.env.API_PREFIX || "api";
const API_VERSION = process.env.API_VERSION || "v1";
app.use(`/${API_PREFIX}/${API_VERSION}/books`, bookRoutes);
app.use(`/${API_PREFIX}/${API_VERSION}/authors`, authorRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Route '${req.method} ${req.url}' not found`,
      availableRoutes: [
        "GET /api/v1/books",
        "POST /api/v1/books",
        "GET /api/v1/books/:id",
        "PUT /api/v1/books/:id",
        "PATCH /api/v1/books/:id",
        "DELETE /api/v1/books/:id",
        "GET /api/v1/authors",
        "POST /api/v1/authors",
        "GET /api/v1/authors/:id",
        "GET /health",
        "GET /api-docs",
      ],
    },
  });
});

// Global Error Handler
app.use(errorHandler);

// Server Start
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Readify Bookstore API running on port ${PORT}`);
    logger.info(`Swagger UI: http://localhost:${PORT}/api-docs`);
    logger.info(`Health Check: http://localhost:${PORT}/health`);
    logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

module.exports = app;
