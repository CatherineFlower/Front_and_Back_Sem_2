const express = require("express");
const cors = require("cors");

// Swagger (OpenAPI)
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const logger = require("./middleware/logger");
const productsRouter = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Конвейер обработки запроса (pipeline) в Express:
 * 1) middleware (app.use(...)) выполняются сверху вниз
 * 2) затем роуты (app.use('/api/...', router))
 * 3) если никто не ответил — можно отдать 404
 */

// 1) Разрешаем запросы с фронта (React dev server)
// Если у вас другой порт фронта — поменяйте origin.
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

// 2) Парсим JSON из тела запроса -> req.body
app.use(express.json());

// 3) Наш логгер (для наглядности)
app.use(logger);


// Swagger definition (OpenAPI 3.0) — генерируем спецификацию из JSDoc-комментариев
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Products API",
      version: "1.0.0",
      description: "Учебный REST API для управления товарами интернет-магазина",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Локальный сервер",
      },
    ],
  },
  // Где искать JSDoc-аннотации (swagger-jsdoc прочитает эти файлы)
  apis: ["./routes/*.js", "./app.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI по адресу /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Healthcheck / главная
app.get("/", (req, res) => {
  res.send("Express API is running. Try /api/products");
});

// 4) Роуты API (все пути /api/products/... обрабатывает productsRouter)
app.use("/api/products", productsRouter);

// Error handler (важно для async/await, чтобы сервер не падал)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 5) Если не совпало ни с одним роутом — 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
