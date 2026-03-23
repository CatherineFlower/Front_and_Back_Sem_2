import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "./api/productsApi";
import "./styles.css";

const initialForm = {
  title: "",
  category: "",
  description: "",
  price: "",
  stock: "",
  rating: "",
  imageUrl: "",
};

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const canSubmit = useMemo(() => {
    return (
        form.title.trim() !== "" &&
        form.category.trim() !== "" &&
        form.description.trim() !== "" &&
        form.price !== "" &&
        form.stock !== ""
    );
  }, [form]);

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const data = await getProducts();
      setItems(data);
    } catch (e) {
      setError(String(e?.response?.data?.error || e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setSubmitting(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      rating: form.rating === "" ? undefined : Number(form.rating),
      imageUrl: form.imageUrl.trim(),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      await loadProducts();
    } catch (e) {
      setError(String(e?.response?.data?.error || e?.message || e));
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setForm({
      title: product.title ?? "",
      category: product.category ?? "",
      description: product.description ?? "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      rating: product.rating === undefined ? "" : String(product.rating),
      imageUrl: product.imageUrl ?? "",
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    setError("");

    try {
      await deleteProduct(id);
      if (editingId === id) {
        resetForm();
      }
      await loadProducts();
    } catch (e) {
      setError(String(e?.response?.data?.error || e?.message || e));
    }
  }

  async function handleRaisePrice(product) {
    setError("");

    try {
      await updateProduct(product.id, { price: Number(product.price) + 1000 });
      await loadProducts();
    } catch (e) {
      setError(String(e?.response?.data?.error || e?.message || e));
    }
  }

  return (
      <div className="page">
        <header className="hero">
          <h1>Практическая работа 5 — Swagger + готовое CRUD-приложение</h1>
          <p>
            Frontend подключён к Express API. Backend полностью задокументирован
            через Swagger UI.
          </p>
          <p>
            Swagger:{" "}
            <a href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer">
              http://localhost:3000/api-docs
            </a>
          </p>
        </header>

        <div className="layout">
          <section className="panel">
            <h2>{editingId ? "Редактирование товара" : "Добавление товара"}</h2>

            <form className="form" onSubmit={handleSubmit}>
              <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Название"
              />
              <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Категория"
              />
              <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Описание"
                  rows={4}
              />
              <input
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Цена"
              />
              <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Остаток на складе"
              />
              <input
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="Рейтинг (0–5)"
              />
              <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="Ссылка на изображение"
              />

              <div className="actions">
                <button type="submit" disabled={!canSubmit || submitting}>
                  {editingId ? "Сохранить изменения" : "Добавить товар"}
                </button>

                <button type="button" className="secondary" onClick={resetForm}>
                  Очистить
                </button>

                <button type="button" className="secondary" onClick={loadProducts}>
                  Обновить список
                </button>
              </div>
            </form>

            {error && <div className="error">Ошибка: {error}</div>}
          </section>

          <section className="panel">
            <h2>Список товаров</h2>

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <div className="products">
                  {items.map((product) => (
                      <article className="product-card" key={product.id}>
                        <div className="product-card__image-wrap">
                          {product.imageUrl ? (
                              <img
                                  src={product.imageUrl}
                                  alt={product.title}
                                  className="product-card__image"
                              />
                          ) : (
                              <div className="product-card__image product-card__image--placeholder">
                                Нет изображения
                              </div>
                          )}
                        </div>

                        <div className="product-card__content">
                          <div className="product-card__top">
                            <h3>{product.title}</h3>
                            <span>{product.category}</span>
                          </div>

                          <p className="product-card__desc">{product.description}</p>

                          <div className="product-card__meta">
                            <span>Цена: {product.price} ₽</span>
                            <span>Остаток: {product.stock}</span>
                            <span>Рейтинг: {product.rating ?? 0}</span>
                          </div>

                          {product.imageUrl && (
                              <a
                                  href={product.imageUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="image-link"
                              >
                                Открыть изображение
                              </a>
                          )}

                          <div className="product-card__actions">
                            <button onClick={() => handleEdit(product)}>
                              Редактировать
                            </button>
                            <button
                                className="secondary"
                                onClick={() => handleRaisePrice(product)}
                            >
                              +1000 ₽
                            </button>
                            <button
                                className="danger"
                                onClick={() => handleDelete(product.id)}
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      </article>
                  ))}
                </div>
            )}
          </section>
        </div>
      </div>
  );
}