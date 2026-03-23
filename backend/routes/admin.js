const express = require("express");
const { authMiddleware, requireRole } = require("../middleware/authJwt");
const { getAllUsers, setUserRole, findUserById } = require("../store/usersStore");

const router = express.Router();

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  };
}

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Получить список пользователей
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 *       403:
 *         description: Только для admin
 */
router.get("/users", authMiddleware, requireRole("admin"), (req, res) => {
  return res.status(200).json(getAllUsers().map(publicUser));
});

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Изменить роль пользователя
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Роль обновлена
 *       403:
 *         description: Только для admin
 */
router.patch("/users/:id/role", authMiddleware, requireRole("admin"), (req, res) => {
  const user = findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const role = String(req.body.role || "").trim();

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "Role must be 'admin' or 'user'" });
  }

  const updated = setUserRole(req.params.id, role);

  return res.status(200).json({
    message: "User role updated",
    user: publicUser(updated),
  });
});

module.exports = router;