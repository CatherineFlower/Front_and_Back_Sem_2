const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const {
  authMiddleware,
  JWT_SECRET,
  REFRESH_SECRET,
  ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
} = require("../middleware/authJwt");
const {
  getAllUsers,
  findUserByEmail,
  findUserById,
  addUser,
  saveRefreshToken,
  hasRefreshToken,
  removeRefreshToken,
  clearUserRefreshTokens,
} = require("../store/usersStore");

const router = express.Router();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  };
}

function createAccessToken(user) {
  return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: ACCESS_EXPIRES_IN }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        tokenVersion: nanoid(6),
      },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRES_IN }
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
 *         role:
 *           type: string
 *           enum: [admin, user]
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

  if (!first_name || !last_name) {
    return res.status(400).json({ error: "first_name and last_name are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must contain at least 6 characters" });
  }

  if (findUserByEmail(email)) {
    return res.status(409).json({ error: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = addUser({
    id: nanoid(8),
    email,
    first_name,
    last_name,
    role: "user",
    passwordHash,
  });

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
 *     responses:
 *       200:
 *         description: accessToken и refreshToken
 */
router.post("/login", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  clearUserRefreshTokens(user.id);

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  saveRefreshToken(refreshToken, user.id);

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
 *     summary: Обновить пару токенов
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Новая пара токенов
 */
router.post("/refresh", (req, res) => {
  const refreshToken = String(req.body.refreshToken || "");

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  if (!hasRefreshToken(refreshToken)) {
    return res.status(401).json({ error: "Refresh token is not recognized" });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = findUserById(payload.sub);

    if (!user) {
      removeRefreshToken(refreshToken);
      return res.status(401).json({ error: "User not found for refresh token" });
    }

    removeRefreshToken(refreshToken);

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    saveRefreshToken(newRefreshToken, user.id);

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: publicUser(user),
    });
  } catch (error) {
    removeRefreshToken(refreshToken);
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить текущего пользователя
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Текущий пользователь
 */
router.get("/me", authMiddleware, (req, res) => {
  const user = getAllUsers().find((item) => item.id === req.user.sub);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({
    user: publicUser(user),
  });
});

module.exports = router;