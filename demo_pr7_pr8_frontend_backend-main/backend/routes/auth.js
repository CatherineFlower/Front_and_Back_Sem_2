const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const authJwt = require("../middleware/authJwt");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

let users = [];

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  };
}

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required: [email, first_name, last_name, password]
 *       properties:
 *         email:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         password:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/AuthUser'
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Пользователь зарегистрирован
 *       400:
 *         description: Ошибка валидации
 *       409:
 *         description: Пользователь уже существует
 */
router.post("/register", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const first_name = String(req.body.first_name || "").trim();
  const last_name = String(req.body.last_name || "").trim();
  const password = String(req.body.password || "");

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  if (!first_name) {
    return res.status(400).json({ error: "first_name is required" });
  }

  if (!last_name) {
    return res.status(400).json({ error: "last_name is required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must contain at least 6 characters" });
  }

  const exists = users.some((user) => user.email === email);
  if (exists) {
    return res.status(409).json({ error: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: nanoid(8),
    email,
    first_name,
    last_name,
    passwordHash,
  };

  users.push(user);

  return res.status(201).json({
    message: "User registered successfully",
    user: publicUser(user),
  });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Успешный вход
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Неверные данные
 */
router.post("/login", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = users.find((item) => item.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
  );

  return res.status(200).json({
    accessToken,
    user: publicUser(user),
  });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить профиль текущего пользователя
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профиль пользователя
 *       401:
 *         description: Нет токена или токен невалиден
 */
router.get("/me", authJwt, (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
    },
  });
});

module.exports = router;