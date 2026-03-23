const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "super-refresh-secret-key";

let users = [
  {
    id: "u1",
    email: "demo@example.com",
    first_name: "Demo",
    last_name: "User",
    passwordHash: bcrypt.hashSync("password123", 10),
  },
];

let refreshTokens = [];

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

function createAccessToken(user) {
  return jwt.sign(
      {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      JWT_SECRET,
      { expiresIn: "20s" }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
      {
        id: user.id,
        email: user.email,
        tokenVersion: nanoid(6),
      },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
  );
}

/**
 * @swagger
 * components:
 *   schemas:
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
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/AuthUser'
 *     RefreshRequest:
 *       type: object
 *       required: [refreshToken]
 *       properties:
 *         refreshToken:
 *           type: string
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
 *             type: object
 *             required: [email, first_name, last_name, password]
 *             properties:
 *               email:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               password:
 *                 type: string
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
 *     summary: Вход пользователя с получением access и refresh токенов
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
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

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  refreshTokens.push({
    token: refreshToken,
    userId: user.id,
  });

  return res.status(200).json({
    accessToken,
    refreshToken,
    user: publicUser(user),
  });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Обновить пару токенов по refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       200:
 *         description: Новая пара токенов
 *       401:
 *         description: Refresh token отсутствует или невалиден
 */
router.post("/refresh", (req, res) => {
  const refreshToken = String(req.body.refreshToken || "");

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  const stored = refreshTokens.find((item) => item.token === refreshToken);
  if (!stored) {
    return res.status(401).json({ error: "Refresh token is not recognized" });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = users.find((item) => item.id === payload.id);

    if (!user) {
      return res.status(401).json({ error: "User not found for refresh token" });
    }

    refreshTokens = refreshTokens.filter((item) => item.token !== refreshToken);

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    refreshTokens.push({
      token: newRefreshToken,
      userId: user.id,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: publicUser(user),
    });
  } catch (error) {
    refreshTokens = refreshTokens.filter((item) => item.token !== refreshToken);
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

module.exports = router;