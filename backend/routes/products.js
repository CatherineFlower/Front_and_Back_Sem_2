const express = require("express");
const { nanoid } = require("nanoid");
const { authMiddleware, requireRole } = require("../middleware/authJwt");
const {
  getAllProducts,
  findProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../store/productsStore");

const router = express.Router();

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isValidNumber(value) {
  return value !== "" && !Number.isNaN(Number(value));
}

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список товаров
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список товаров для user/admin
 */
router.get("/", authMiddleware, (req, res) => {
  return res.status(200).json(getAllProducts());
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать товар (только admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, requireRole("admin"), (req, res) => {
  const { title, category, description, price, stock, imageUrl } = req.body;

  if (!isNonEmptyString(title) || !isNonEmptyString(category) || !isNonEmptyString(description)) {
    return res.status(400).json({ error: "title, category and description are required" });
  }

  if (!isValidNumber(price) || Number(price) < 0) {
    return res.status(400).json({ error: "price must be a number >= 0" });
  }

  if (!isValidNumber(stock) || Number(stock) < 0) {
    return res.status(400).json({ error: "stock must be a number >= 0" });
  }

  const product = addProduct({
    id: nanoid(8),
    title: title.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock),
    imageUrl: typeof imageUrl === "string" ? imageUrl.trim() : "",
  });

  return res.status(201).json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить товар (только admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id", authMiddleware, requireRole("admin"), (req, res) => {
  const product = findProductById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const patch = {};

  if (req.body.title !== undefined) {
    if (!isNonEmptyString(req.body.title)) {
      return res.status(400).json({ error: "title must be a non-empty string" });
    }
    patch.title = req.body.title.trim();
  }

  if (req.body.category !== undefined) {
    if (!isNonEmptyString(req.body.category)) {
      return res.status(400).json({ error: "category must be a non-empty string" });
    }
    patch.category = req.body.category.trim();
  }

  if (req.body.description !== undefined) {
    if (!isNonEmptyString(req.body.description)) {
      return res.status(400).json({ error: "description must be a non-empty string" });
    }
    patch.description = req.body.description.trim();
  }

  if (req.body.price !== undefined) {
    if (!isValidNumber(req.body.price) || Number(req.body.price) < 0) {
      return res.status(400).json({ error: "price must be a number >= 0" });
    }
    patch.price = Number(req.body.price);
  }

  if (req.body.stock !== undefined) {
    if (!isValidNumber(req.body.stock) || Number(req.body.stock) < 0) {
      return res.status(400).json({ error: "stock must be a number >= 0" });
    }
    patch.stock = Number(req.body.stock);
  }

  if (req.body.imageUrl !== undefined) {
    if (typeof req.body.imageUrl !== "string") {
      return res.status(400).json({ error: "imageUrl must be a string" });
    }
    patch.imageUrl = req.body.imageUrl.trim();
  }

  const updated = updateProduct(req.params.id, patch);
  return res.status(200).json(updated);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар (только admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", authMiddleware, requireRole("admin"), (req, res) => {
  const ok = deleteProduct(req.params.id);

  if (!ok) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.status(200).json({ ok: true });
});

module.exports = router;