const bcrypt = require("bcrypt");

const users = [
  {
    id: "u-admin",
    email: "admin@example.com",
    first_name: "Admin",
    last_name: "User",
    role: "admin",
    passwordHash: bcrypt.hashSync("admin123", 10),
  },
  {
    id: "u-user",
    email: "user@example.com",
    first_name: "Regular",
    last_name: "User",
    role: "user",
    passwordHash: bcrypt.hashSync("user12345", 10),
  },
];

const refreshTokens = new Map();

function getAllUsers() {
  return users;
}

function findUserById(id) {
  return users.find((user) => user.id === id) || null;
}

function findUserByEmail(email) {
  return users.find((user) => user.email === email) || null;
}

function addUser(user) {
  users.push(user);
  return user;
}

function setUserRole(id, role) {
  const user = findUserById(id);
  if (!user) return null;
  user.role = role;
  return user;
}

function saveRefreshToken(token, userId) {
  refreshTokens.set(token, userId);
}

function hasRefreshToken(token) {
  return refreshTokens.has(token);
}

function removeRefreshToken(token) {
  refreshTokens.delete(token);
}

function clearUserRefreshTokens(userId) {
  for (const [token, storedUserId] of refreshTokens.entries()) {
    if (storedUserId === userId) {
      refreshTokens.delete(token);
    }
  }
}

module.exports = {
  getAllUsers,
  findUserById,
  findUserByEmail,
  addUser,
  setUserRole,
  saveRefreshToken,
  hasRefreshToken,
  removeRefreshToken,
  clearUserRefreshTokens,
};