const express = require("express");
const { nanoid } = require("nanoid");
const authJwt = require("../middleware/authJwt");

const router = express.Router();

let products = [
  {
    id: "p1",
    title: "Ноутбук ASUS VivoBook",
    category: "Электроника",
    description: "Компактный ноутбук для учёбы и работы.",
    price: 64990,
    stock: 5,
  },
  {
    id: "p2",
    title: "Игровая мышь Logitech",
    category: "Периферия",
    description: "Проводная мышь с точным сенсором.",
    price: 3990,
    stock: 12,
  },
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 */
router.get("/", (req, res) => {
  return res.status(200).json(products);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать товар
 *     tags: [Products]
 *     responses:
 *       201:
 *         description: Товар создан
 */
router.post("/", (req, res) => {
  const title = String(req.body.title || "").trim();
  const category = String(req.body.category || "").trim();
  const description = String(req.body.description || "").trim();
  const price = Number(req.body.price);
  const stock = Number(req.body.stock);

  if (!title || !category || !description) {
    return res.status(400).json({ error: "title, category and description are required" });
  }

  if (Number.isNaN(price) || price < 0) {
    return res.status(400).json({ error: "price must be a number >= 0" });
  }

  if (Number.isNaN(stock) || stock < 0) {
    return res.status(400).json({ error: "stock must be a number >= 0" });
  }

  const product = {
    id: nanoid(8),
    title,
    category,
    description,
    price,
    stock,
  };

  products.push(product);
  return res.status(201).json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по id
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Товар найден
 *       401:
 *         description: Нет токена
 *       404:
 *         description: Товар не найден
 */
router.get("/:id", authJwt, (req, res) => {
  const product = products.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  return res.status(200).json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Обновить товар по id
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Товар обновлён
 *       401:
 *         description: Нет токена
 *       404:
 *         description: Товар не найден
 */
router.put("/:id", authJwt, (req, res) => {
  const product = products.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const title = String(req.body.title || "").trim();
  const category = String(req.body.category || "").trim();
  const description = String(req.body.description || "").trim();
  const price = Number(req.body.price);
  const stock = Number(req.body.stock);

  if (!title || !category || !description) {
    return res.status(400).json({ error: "title, category and description are required" });
  }

  if (Number.isNaN(price) || price < 0) {
    return res.status(400).json({ error: "price must be a number >= 0" });
  }

  if (Number.isNaN(stock) || stock < 0) {
    return res.status(400).json({ error: "stock must be a number >= 0" });
  }

  product.title = title;
  product.category = category;
  product.description = description;
  product.price = price;
  product.stock = stock;

  return res.status(200).json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар по id
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Товар удалён
 *       401:
 *         description: Нет токена
 *       404:
 *         description: Товар не найден
 */
router.delete("/:id", authJwt, (req, res) => {
  const before = products.length;
  products = products.filter((item) => item.id !== req.params.id);

  if (before === products.length) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.status(200).json({ ok: true });
});

module.exports = router;