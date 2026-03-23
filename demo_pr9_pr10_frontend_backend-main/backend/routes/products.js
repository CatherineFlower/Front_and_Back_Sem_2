const express = require("express");
const authJwt = require("../middleware/authJwt");

const router = express.Router();

const products = [
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
 *     summary: Получить защищённый список товаров
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список товаров
 *       401:
 *         description: Нет access token
 */
router.get("/", authJwt, (req, res) => {
  return res.status(200).json(products);
});

module.exports = router;