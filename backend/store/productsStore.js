let products = [
  {
    id: "p1",
    title: "Ноутбук ASUS VivoBook",
    category: "Электроника",
    description: "Компактный ноутбук для учёбы и программирования.",
    price: 64990,
    stock: 5,
    imageUrl:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p2",
    title: "Игровая мышь Logitech",
    category: "Периферия",
    description: "Проводная мышь с точным сенсором.",
    price: 3990,
    stock: 12,
    imageUrl:
        "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p3",
    title: "Механическая клавиатура Keychron",
    category: "Периферия",
    description: "Клавиатура с подсветкой и hot-swap переключателями.",
    price: 8990,
    stock: 7,
    imageUrl:
        "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80",
  },
];

function getAllProducts() {
  return products;
}

function findProductById(id) {
  return products.find((product) => product.id === id) || null;
}

function addProduct(product) {
  products.push(product);
  return product;
}

function updateProduct(id, patch) {
  const product = findProductById(id);
  if (!product) return null;
  Object.assign(product, patch);
  return product;
}

function deleteProduct(id) {
  const before = products.length;
  products = products.filter((product) => product.id !== id);
  return products.length !== before;
}

module.exports = {
  getAllProducts,
  findProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};