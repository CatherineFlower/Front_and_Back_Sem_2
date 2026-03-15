const express = require("express");
const { nanoid } = require("nanoid");

const router = express.Router();

let products = require("../data/products");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный ID товара
 *         title:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена товара
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *         rating:
 *           type: number
 *           description: Рейтинг (опционально)
 *         imageUrl:
 *           type: string
 *           description: URL картинки (опционально)
 *       example:
 *         id: "p1"
 *         title: "Печенье"
 *         category: "Сладости"
 *         description: "Хрустящее печенье к чаю."
 *         price: 79
 *         stock: 20
 *         rating: 4.6
 *         imageUrl: ""
 */

/**
 * Вспомогательная функция: найти товар по id (id строковый)
 */
function findById(id) {
  return products.find((p) => p.id === id) || null;
}

/**
 * TODO (Практика 5):
 * 1) Допишите Swagger-аннотации для оставшихся операций:
 *    - GET /api/products/:id
 *    - PATCH /api/products/:id
 *    - DELETE /api/products/:id
 * 2) Убедитесь, что все операции отображаются в Swagger UI: http://localhost:3000/api-docs
 *
 * TODO (Практика 3): 
 * Добавьте валидацию входных данных: title/category/description/price/stock
 * и правильные статусы 400/404/201.
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
// GET /api/products — список товаров
router.get("/", (req, res) => {
  res.json(products);
});

// GET /api/products/:id — один товар
router.get("/:id", (req, res) => {
  const product = findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создаёт новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в теле запроса
 */
// POST /api/products — добавить товар
router.post("/", (req, res) => {
  const { title, category, description, price, stock, rating, imageUrl } = req.body;

  // TODO (студентам): полноценная валидация, иначе можно сохранить "мусор"
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title is required (string)" });
  }

  const newProduct = {
    id: nanoid(8),
    title: title.trim(),
    category: typeof category === "string" ? category.trim() : "Без категории",
    description: typeof description === "string" ? description.trim() : "",
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    rating: rating !== undefined ? Number(rating) : undefined,
    imageUrl: typeof imageUrl === "string" ? imageUrl.trim() : "",
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PATCH /api/products/:id — частичное обновление
router.patch("/:id", (req, res) => {
  const product = findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const { title, category, description, price, stock, rating, imageUrl } = req.body;

  // TODO (студентам): валидация PATCH (если поле пришло — проверить)
  if (title !== undefined) product.title = String(title).trim();
  if (category !== undefined) product.category = String(category).trim();
  if (description !== undefined) product.description = String(description).trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (rating !== undefined) product.rating = Number(rating);
  if (imageUrl !== undefined) product.imageUrl = String(imageUrl).trim();

  res.json(product);
});

// DELETE /api/products/:id — удалить товар
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const before = products.length;
  products = products.filter((p) => p.id !== id);

  if (products.length === before) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Обычно делают 204 No Content, но для наглядности вернём JSON
  res.json({ ok: true });
});

module.exports = router;
