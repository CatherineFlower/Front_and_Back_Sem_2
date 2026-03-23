import { useState } from "react";
import { loginUser, logoutUser, registerUser } from "./api/authApi";
import { getProtectedProducts } from "./api/productsApi";
import { getAccessToken, getRefreshToken } from "./api/apiClient";
import "./styles.css";

const registerInitial = {
  email: "",
  first_name: "",
  last_name: "",
  password: "",
};

const loginInitial = {
  email: "demo@example.com",
  password: "password123",
};

export default function App() {
  const [registerForm, setRegisterForm] = useState(registerInitial);
  const [loginForm, setLoginForm] = useState(loginInitial);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [accessTokenView, setAccessTokenView] = useState(getAccessToken());
  const [refreshTokenView, setRefreshTokenView] = useState(getRefreshToken());

  function updateTokenViews() {
    setAccessTokenView(getAccessToken());
    setRefreshTokenView(getRefreshToken());
  }

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
      await loginUser(loginForm);
      updateTokenViews();
      setMessage("Вход выполнен. Access token и refresh token сохранены.");
    } catch (e) {
      setError(String(e?.response?.data?.error || e?.message || e));
    }
  }

  async function handleLoadProtectedProducts() {
    setError("");
    setMessage("");

    try {
      const result = await getProtectedProducts();
      setProducts(result);
      updateTokenViews();
      setMessage("Защищённый запрос выполнен успешно.");
    } catch (e) {
      setError(String(e?.response?.data?.error || e?.message || e));
      updateTokenViews();
    }
  }

  function handleLogout() {
    logoutUser();
    setProducts([]);
    updateTokenViews();
    setMessage("Токены удалены. Выполнен выход.");
    setError("");
  }

  return (
      <div className="page">
        <header className="hero">
          <h1>Практические работы 9–10</h1>
          <p>JWT access token, refresh token и автоматическое обновление токена через axios interceptors.</p>
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
              <button type="button" className="secondary" onClick={handleLoadProtectedProducts}>
                Загрузить защищённые товары
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
          <code className="token">{accessTokenView || "Нет access token"}</code>
          <p><strong>Refresh token:</strong></p>
          <code className="token">{refreshTokenView || "Нет refresh token"}</code>
        </section>

        <section className="panel">
          <h2>Защищённые товары</h2>
          <p>
            Для проверки авто-refresh можно подождать примерно 20 секунд после входа,
            а затем снова нажать кнопку «Загрузить защищённые товары». Frontend сам
            выполнит `/auth/refresh` и повторит исходный запрос.
          </p>

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