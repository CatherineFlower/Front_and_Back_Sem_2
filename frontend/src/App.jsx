import { useMemo, useState } from "react";
import { getAccessToken, getRefreshToken } from "./api/apiClient";
import { getMe, loginUser, logoutUser, registerUser } from "./api/authApi";
import { changeUserRole, getUsersList } from "./api/adminApi";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "./api/productsApi";
import "./styles.css";

const registerInitial = {
  email: "",
  first_name: "",
  last_name: "",
  password: "",
};

const loginInitial = {
  email: "admin@example.com",
  password: "admin123",
};

const productInitial = {
  title: "",
  category: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
};

export default function App() {
  const [registerForm, setRegisterForm] = useState(registerInitial);
  const [loginForm, setLoginForm] = useState(loginInitial);
  const [productForm, setProductForm] = useState(productInitial);
  const [editingId, setEditingId] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isAdmin = currentUser?.role === "admin";

  const canSubmitProduct = useMemo(() => {
    return (
        productForm.title.trim() &&
        productForm.category.trim() &&
        productForm.description.trim() &&
        productForm.price !== "" &&
        productForm.stock !== ""
    );
  }, [productForm]);

  function syncMessage(nextMessage = "", nextError = "") {
    setMessage(nextMessage);
    setError(nextError);
  }

  function onRegisterChange(e) {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  }

  function onLoginChange(e) {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  }

  function onProductChange(e) {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleRegister(e) {
    e.preventDefault();
    syncMessage();

    try {
      const result = await registerUser(registerForm);
      setRegisterForm(registerInitial);
      syncMessage(result.message || "Пользователь зарегистрирован");
    } catch (e) {
      syncMessage("", String(e?.response?.data?.error || e?.message || e));
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    syncMessage();

    try {
      const result = await loginUser(loginForm);
      setCurrentUser(result.user);
      syncMessage("Вход выполнен. Токены сохранены.");
    } catch (e) {
      syncMessage("", String(e?.response?.data?.error || e?.message || e));
    }
  }

  async function handleMe() {
    syncMessage();

    try {
      const result = await getMe();
      setCurrentUser(result.user);
      syncMessage("Профиль успешно получен");
    } catch (e) {
      syncMessage("", String(e?.response?.data?.error || e?.message || e));
    }
  }

  function handleLogout() {
    logoutUser();
    setCurrentUser(null);
    setUsers([]);
    setProducts([]);
    setEditingId(null);
    setProductForm(productInitial);
    syncMessage("Выход выполнен");
  }

  async function handleLoadUsers() {
    syncMessage();

    try {
      const result = await getUsersList();
      setUsers(result);
      syncMessage("Список пользователей загружен");
    } catch (e) {
      syncMessage("", String(e?.response?.data?.message || e?.response?.data?.error || e?.message || e));
    }
  }

  async function handleChangeRole(id, role) {
    syncMessage();

    try {
      const result = await changeUserRole(id, role);
      setUsers((prev) =>
          prev.map((user) => (user.id === id ? result.user : user))
      );

      if (currentUser?.id === id) {
        setCurrentUser((prev) => ({ ...prev, role }));
      }

      syncMessage("Роль пользователя обновлена. Для полной синхронизации лучше перелогиниться.");
    } catch (e) {
      syncMessage("", String(e?.response?.data?.message || e?.response?.data?.error || e?.message || e));
    }
  }

  async function handleLoadProducts() {
    syncMessage();

    try {
      const result = await getProducts();
      setProducts(result);
      syncMessage("Список товаров загружен");
    } catch (e) {
      syncMessage("", String(e?.response?.data?.message || e?.response?.data?.error || e?.message || e));
    }
  }

  function startEdit(product) {
    setEditingId(product.id);
    setProductForm({
      title: product.title,
      category: product.category,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl || "",
    });
    syncMessage("Редактирование товара");
  }

  function resetProductForm() {
    setEditingId(null);
    setProductForm(productInitial);
  }

  async function handleSubmitProduct(e) {
    e.preventDefault();
    syncMessage();

    const payload = {
      title: productForm.title.trim(),
      category: productForm.category.trim(),
      description: productForm.description.trim(),
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      imageUrl: productForm.imageUrl.trim(),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        syncMessage("Товар обновлён");
      } else {
        await createProduct(payload);
        syncMessage("Товар создан");
      }

      resetProductForm();
      await handleLoadProducts();
    } catch (e) {
      syncMessage("", String(e?.response?.data?.message || e?.response?.data?.error || e?.message || e));
    }
  }

  async function handleDeleteProduct(id) {
    syncMessage();

    try {
      await deleteProduct(id);
      if (editingId === id) {
        resetProductForm();
      }
      await handleLoadProducts();
      syncMessage("Товар удалён");
    } catch (e) {
      syncMessage("", String(e?.response?.data?.message || e?.response?.data?.error || e?.message || e));
    }
  }

  return (
      <div className="page">
        <header className="hero">
          <h1>Практики 11–12 — RBAC + контрольная</h1>
          <p>Роли admin/user, refresh-механика и контроль доступа на backend и frontend.</p>
          <p>
            Swagger:{" "}
            <a href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer">
              http://localhost:3000/api-docs
            </a>
          </p>
        </header>

        <div className="layout two-cols">
          <section className="panel">
            <h2>Регистрация</h2>
            <form className="form" onSubmit={handleRegister}>
              <input name="email" value={registerForm.email} onChange={onRegisterChange} placeholder="Email" />
              <input name="first_name" value={registerForm.first_name} onChange={onRegisterChange} placeholder="Имя" />
              <input name="last_name" value={registerForm.last_name} onChange={onRegisterChange} placeholder="Фамилия" />
              <input name="password" type="password" value={registerForm.password} onChange={onRegisterChange} placeholder="Пароль" />
              <button type="submit">Зарегистрироваться</button>
            </form>
          </section>

          <section className="panel">
            <h2>Вход</h2>
            <form className="form" onSubmit={handleLogin}>
              <input name="email" value={loginForm.email} onChange={onLoginChange} placeholder="Email" />
              <input name="password" type="password" value={loginForm.password} onChange={onLoginChange} placeholder="Пароль" />
              <button type="submit">Войти</button>
            </form>

            <div className="actions">
              <button type="button" className="secondary" onClick={handleMe}>
                Проверить профиль
              </button>
              <button type="button" className="danger" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          </section>
        </div>

        {message && <div className="message">{message}</div>}
        {error && <div className="error">Ошибка: {error}</div>}

        <section className="panel">
          <h2>Текущие токены</h2>
          <p><strong>Access token:</strong></p>
          <code className="token">{getAccessToken() || "Нет access token"}</code>
          <p><strong>Refresh token:</strong></p>
          <code className="token">{getRefreshToken() || "Нет refresh token"}</code>
        </section>

        {currentUser && (
            <section className="panel">
              <h2>Текущий пользователь</h2>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Имя:</strong> {currentUser.first_name}</p>
              <p><strong>Фамилия:</strong> {currentUser.last_name}</p>
              <p><strong>Роль:</strong> {currentUser.role}</p>
            </section>
        )}

        <div className="layout two-cols">
          <section className="panel">
            <div className="section-head">
              <h2>Товары</h2>
              <button className="secondary" onClick={handleLoadProducts}>
                Загрузить товары
              </button>
            </div>

            <div className="products">
              {products.map((product) => (
                  <article key={product.id} className="product-card">
                    <div className="product-card__image-wrap">
                      {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.title} className="product-card__image" />
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
                      </div>

                      {isAdmin && (
                          <div className="product-card__actions">
                            <button onClick={() => startEdit(product)}>Редактировать</button>
                            <button className="danger" onClick={() => handleDeleteProduct(product.id)}>
                              Удалить
                            </button>
                          </div>
                      )}
                    </div>
                  </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>{editingId ? "Редактирование товара" : "Создание товара"}</h2>

            {isAdmin ? (
                <form className="form" onSubmit={handleSubmitProduct}>
                  <input name="title" value={productForm.title} onChange={onProductChange} placeholder="Название" />
                  <input name="category" value={productForm.category} onChange={onProductChange} placeholder="Категория" />
                  <textarea name="description" value={productForm.description} onChange={onProductChange} placeholder="Описание" rows={4} />
                  <input name="price" type="number" value={productForm.price} onChange={onProductChange} placeholder="Цена" />
                  <input name="stock" type="number" value={productForm.stock} onChange={onProductChange} placeholder="Остаток" />
                  <input name="imageUrl" value={productForm.imageUrl} onChange={onProductChange} placeholder="Ссылка на изображение" />

                  <div className="actions">
                    <button type="submit" disabled={!canSubmitProduct}>
                      {editingId ? "Сохранить" : "Создать"}
                    </button>
                    <button type="button" className="secondary" onClick={resetProductForm}>
                      Очистить
                    </button>
                  </div>
                </form>
            ) : (
                <p>Создание и изменение товаров доступно только пользователю с ролью admin.</p>
            )}
          </section>
        </div>

        <section className="panel">
          <div className="section-head">
            <h2>Admin-панель пользователей</h2>
            <button className="secondary" onClick={handleLoadUsers}>
              Загрузить пользователей
            </button>
          </div>

          {isAdmin ? (
              <div className="users-table">
                {users.map((user) => (
                    <div key={user.id} className="user-row">
                      <div>
                        <strong>{user.email}</strong>
                        <div>{user.first_name} {user.last_name}</div>
                        <div>Текущая роль: {user.role}</div>
                      </div>

                      <div className="actions">
                        <button
                            className="secondary"
                            onClick={() => handleChangeRole(user.id, "user")}
                            disabled={user.role === "user"}
                        >
                          Сделать user
                        </button>
                        <button
                            onClick={() => handleChangeRole(user.id, "admin")}
                            disabled={user.role === "admin"}
                        >
                          Сделать admin
                        </button>
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <p>Эта панель доступна только admin.</p>
          )}
        </section>
      </div>
  );
}