const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const logger = require("./middleware/logger");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const productsRouter = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
      origin: "http://localhost:3001",
    })
);

app.use(express.json());
app.use(logger);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RBAC Products API",
      version: "1.0.0",
      description: "Практики 11–12: роли, RBAC, refresh tokens, admin API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Локальный сервер",
      },
    ],
  },
  apis: ["./routes/*.js", "./middleware/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.get("/", (req, res) => {
  res.send("Express API is running. Open /api-docs");
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});