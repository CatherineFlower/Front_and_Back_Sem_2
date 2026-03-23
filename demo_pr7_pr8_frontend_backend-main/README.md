# Практические работы 7–8 по дисциплине «Фронтенд и бэкенд разработка»

## Информация о работе

В данной ветке представлено решение практических работ №7 и №8 по дисциплине «Фронтенд и бэкенд разработка».

Практическая работа №7 посвящена базовой аутентификации пользователя с использованием bcrypt для безопасного хранения пароля.  
Практическая работа №8 посвящена выдаче JWT access token, проверке токена через middleware и реализации защищённых маршрутов.

## Что реализовано

В ходе выполнения работы были реализованы:

- регистрация пользователя;
- хранение пароля в виде bcrypt-хеша;
- вход пользователя с проверкой пароля через bcrypt.compare;
- выдача JWT access token;
- middleware для проверки Bearer-токена;
- защищённый маршрут `GET /api/auth/me`;
- защита маршрутов товаров `GET /api/products/:id`, `PUT /api/products/:id`, `DELETE /api/products/:id`;
- документация маршрутов через Swagger UI;
- frontend-приложение с формами регистрации и входа;
- получение профиля текущего пользователя на фронте;
- проверка защищённого маршрута с использованием токена.

## Используемые технологии

### Backend
- Node.js
- Express
- bcrypt
- jsonwebtoken
- swagger-jsdoc
- swagger-ui-express
- CORS
- nanoid
- Nodemon

### Frontend
- React
- Vite
- Axios

## Запуск backend

```bash
cd backend
npm install
npm run dev
```

После запуска сервер доступен по адресу:

```text
http://localhost:3000
```

Swagger UI:

```text
http://localhost:3000/api-docs
```

## Запуск frontend

```bash
cd frontend
npm install
npm run dev
```

После запуска frontend доступен по адресу:

```text
http://localhost:3001
```

## Основные маршруты API

### Аутентификация
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` — защищённый маршрут

### Товары
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id` — защищённый маршрут
- `PUT /api/products/:id` — защищённый маршрут
- `DELETE /api/products/:id` — защищённый маршрут

## Результат

Ветка содержит завершённое решение практических работ №7 и №8.  
Backend реализует аутентификацию пользователя и защищённые маршруты с JWT.  
Frontend позволяет зарегистрироваться, войти, получить токен и проверить защищённые API-запросы.
