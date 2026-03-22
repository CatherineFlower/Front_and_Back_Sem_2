const express = require("express");
const { nanoid } = require("nanoid");

const router = express.Router();
let products = require("../data/products");

function findById(id) {
  return products.find((product) => product.id === id) || null;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isValidNumber(value) {
  return value !== "" && !Number.isNaN(Number(value));
}

router.get("/", (req, res) => {
  res.status(200).json(products);
});

router.get("/:id", (req, res) => {
  const product = findById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.status(200).json(product);
});

router.post("/", (req, res) => {
  const { title, category, description, price, stock, rating, imageUrl } = req.body;

  if (!isNonEmptyString(title)) {
    return res.status(400).json({ error: "Field 'title' is required and must be a non-empty string" });
  }

  if (!isNonEmptyString(category)) {
    return res.status(400).json({ error: "Field 'category' is required and must be a non-empty string" });
  }

  if (!isNonEmptyString(description)) {
    return res.status(400).json({ error: "Field 'description' is required and must be a non-empty string" });
  }

  if (!isValidNumber(price) || Number(price) < 0) {
    return res.status(400).json({ error: "Field 'price' is required and must be a number >= 0" });
  }

  if (!isValidNumber(stock) || Number(stock) < 0) {
    return res.status(400).json({ error: "Field 'stock' is required and must be a number >= 0" });
  }

  if (rating !== undefined && (!isValidNumber(rating) || Number(rating) < 0 || Number(rating) > 5)) {
    return res.status(400).json({ error: "Field 'rating' must be a number from 0 to 5" });
  }

  if (imageUrl !== undefined && typeof imageUrl !== "string") {
    return res.status(400).json({ error: "Field 'imageUrl' must be a string" });
  }

  const newProduct = {
    id: nanoid(8),
    title: title.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock),
    rating: rating !== undefined ? Number(rating) : 0,
    imageUrl: typeof imageUrl === "string" ? imageUrl.trim() : "",
  };

  products.push(newProduct);

  return res.status(201).json(newProduct);
});

router.patch("/:id", (req, res) => {
  const product = findById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { title, category, description, price, stock, rating, imageUrl } = req.body;

  if (title !== undefined) {
    if (!isNonEmptyString(title)) {
      return res.status(400).json({ error: "Field 'title' must be a non-empty string" });
    }
    product.title = title.trim();
  }

  if (category !== undefined) {
    if (!isNonEmptyString(category)) {
      return res.status(400).json({ error: "Field 'category' must be a non-empty string" });
    }
    product.category = category.trim();
  }

  if (description !== undefined) {
    if (!isNonEmptyString(description)) {
      return res.status(400).json({ error: "Field 'description' must be a non-empty string" });
    }
    product.description = description.trim();
  }

  if (price !== undefined) {
    if (!isValidNumber(price) || Number(price) < 0) {
      return res.status(400).json({ error: "Field 'price' must be a number >= 0" });
    }
    product.price = Number(price);
  }

  if (stock !== undefined) {
    if (!isValidNumber(stock) || Number(stock) < 0) {
      return res.status(400).json({ error: "Field 'stock' must be a number >= 0" });
    }
    product.stock = Number(stock);
  }

  if (rating !== undefined) {
    if (!isValidNumber(rating) || Number(rating) < 0 || Number(rating) > 5) {
      return res.status(400).json({ error: "Field 'rating' must be a number from 0 to 5" });
    }
    product.rating = Number(rating);
  }

  if (imageUrl !== undefined) {
    if (typeof imageUrl !== "string") {
      return res.status(400).json({ error: "Field 'imageUrl' must be a string" });
    }
    product.imageUrl = imageUrl.trim();
  }

  return res.status(200).json(product);
});

router.delete("/:id", (req, res) => {
  const before = products.length;
  products = products.filter((product) => product.id !== req.params.id);

  if (products.length === before) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.status(200).json({ ok: true });
});

module.exports = router;