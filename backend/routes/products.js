const express = require("express");
const router = express.Router();

let products = require("../data/products");

function findById(id) {
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return null;
  }

  return products.find((product) => product.id === numericId) || null;
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
  const { title, price } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Field 'title' is required and must be a non-empty string" });
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ error: "Field 'price' is required and must be a number >= 0" });
  }

  const nextId =
      products.length > 0
          ? Math.max(...products.map((product) => product.id)) + 1
          : 1;

  const newProduct = {
    id: nextId,
    title: title.trim(),
    price: numericPrice,
  };

  products.push(newProduct);

  return res.status(201).json(newProduct);
});

router.patch("/:id", (req, res) => {
  const product = findById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { title, price } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "Field 'title' must be a non-empty string" });
    }

    product.title = title.trim();
  }

  if (price !== undefined) {
    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: "Field 'price' must be a number >= 0" });
    }

    product.price = numericPrice;
  }

  return res.status(200).json(product);
});

router.delete("/:id", (req, res) => {
  const numericId = Number(req.params.id);

  if (Number.isNaN(numericId)) {
    return res.status(400).json({ error: "Product id must be a number" });
  }

  const productExists = products.some((product) => product.id === numericId);

  if (!productExists) {
    return res.status(404).json({ error: "Product not found" });
  }

  products = products.filter((product) => product.id !== numericId);

  return res.status(200).json({ ok: true });
});

module.exports = router;