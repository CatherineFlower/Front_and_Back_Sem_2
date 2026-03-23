import { useEffect, useState } from "react";
import { getProducts } from "./api/productsApi";
import {
  getMe,
  getProtectedProduct,
  loginUser,
  registerUser,
} from "./api/authApi";
import "./styles.css";

const registerInitial = {
  email: "",
  first_name: "",
  last_name: "",
  password: "",
};

const loginInitial = {
  email: "",
  password: "",
};

export default function App() {
  const [registerForm, setRegisterForm] = useState(registerInitial);
  const [loginForm, setLoginForm] = useState(loginInitial);
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [protectedProduct, setProtectedProduct] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      setError(String(e?.response?.data?.error || e?.message || e));
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function onRegisterChange(e) {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  }

  function onLoginChange(e) {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const result = await registerUser(registerForm);
      setMessage(result.message || "Пользователь зарегистрирован");
      setRegisterForm(registerInitial);
    } catch (e) {
      setError(String(e?.response?.data?.error || e?.message || e));
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const result = await loginUser(loginForm);
      setToken(result.accessToken);
      localStorage.setItem("accessToken", result.accessToken);
      setUser(result.user);
      setMessage("Вход выполнен успешно");
      setLoginForm(loginInitial);
    } catch (e) {
      setError(String(e?.response?.data?.error || e?.message || e));
    }
  }

  async function handleMe() {
    setError("");
    setMessage("");

    try {
      const result = await getMe(token);
      setUser(result.user);
      setMessage("Профиль успешно получен");
    } catch (e) {
      setError(String(e?.response?.data?.error || e?.message || e));
    }
  }

  async function handleProtectedProduct() {
    setError("");
    setMessage("");

    if (!products.length) return;

    try {
      const result = await getProtectedProduct(products[0].id, token);
      setProtectedProduct(result);
      setMessage("Защищённый товар успешно получен");
    } catch (e) {
      setError(String(e?.response?.data?.error || e?.message || e));
    }
  }

  function handleLogout() {
    setToken("");
    setUser(null);
    setProtectedProduct(null);
    localStorage.removeItem("accessToken");
    setMessage("Выход выполнен");
    setError("");
  }

  return (
      <div className="page">
        <header className="hero">
          <h1>Практические работы 7–8</h1>
          <p>Регистрация, вход, JWT и защищённые маршруты.</p>
          <p>
            Swagger:{" "}
            <a href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer">
              http://localhost:3000/api-docs
            </a>
          </p>
        </header>

        <div className="layout">
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
              <button type="button" className="secondary" onClick={handleMe} disabled={!token}>
                Проверить профиль
              </button>
              <button type="button" className="secondary" onClick={handleProtectedProduct} disabled={!token}>
                Проверить защищённый товар
              </button>
              <button type="button" className="danger" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          </section>
        </div>

        {message && <div className="message">{message}</div>}
        {error && <div className="error">Ошибка: {error}</div>}

        {token && (
            <section className="panel">
              <h2>Токен</h2>
              <code className="token">{token}</code>
            </section>
        )}

        {user && (
            <section className="panel">
              <h2>Текущий пользователь</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Имя:</strong> {user.first_name}</p>
              <p><strong>Фамилия:</strong> {user.last_name}</p>
            </section>
        )}

        {protectedProduct && (
            <section className="panel">
              <h2>Защищённый товар</h2>
              <p><strong>Название:</strong> {protectedProduct.title}</p>
              <p><strong>Категория:</strong> {protectedProduct.category}</p>
              <p><strong>Цена:</strong> {protectedProduct.price} ₽</p>
            </section>
        )}

        <section className="panel">
          <h2>Открытый список товаров</h2>
          <div className="products">
            {products.map((product) => (
                <article key={product.id} className="product-card">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <p><strong>Категория:</strong> {product.category}</p>
                  <p><strong>Цена:</strong> {product.price} ₽</p>
                  <p><strong>Остаток:</strong> {product.stock}</p>
                </article>
            ))}
          </div>
        </section>
      </div>
  );
}