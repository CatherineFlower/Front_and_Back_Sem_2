# Практические работы 11–12 по дисциплине «Фронтенд и бэкенд разработка»

## Информация о работе

В данной ветке представлено решение практических работ №11 и №12 по дисциплине «Фронтенд и бэкенд разработка».

Практическая работа №11 посвящена реализации ролевой модели доступа (RBAC) с ролями `admin` и `user`.  
Практическая работа №12 посвящена демонстрации полной системы: аутентификация, refresh tokens, роли, admin API и разграничение прав на операции с товарами.

## Что реализовано

В ходе выполнения работы были реализованы:

- регистрация пользователя;
- вход пользователя с получением `accessToken` и `refreshToken`;
- автоматическое обновление access token через endpoint refresh;
- хранение токенов на frontend;
- роли `admin` и `user`;
- middleware `requireRole("admin")`;
- маршрут `GET /api/admin/users` только для admin;
- маршрут `PATCH /api/admin/users/:id/role` только для admin;
- просмотр товаров для `user` и `admin`;
- создание, изменение и удаление товаров только для `admin`;
- frontend-панель для демонстрации ролей, пользователей и товаров;
- Swagger UI для проверки backend API.

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

## Тестовые пользователи

### Admin
- email: `admin@example.com`
- password: `admin123`

### User
- email: `user@example.com`
- password: `user12345`

## Запуск backend

```bash
cd backend
npm install
npm run dev
```

После запуска сервер будет доступен по адресу:

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

После запуска frontend будет доступен по адресу:

```text
http://localhost:3001
```

## Основные маршруты API

### Аутентификация
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

### Admin API
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/role`

### Товары
- `GET /api/products` — доступно `user` и `admin`
- `POST /api/products` — только `admin`
- `PATCH /api/products/:id` — только `admin`
- `DELETE /api/products/:id` — только `admin`

## Результат

Ветка содержит завершённое решение практических работ №11 и №12.  
Backend реализует ролевую модель доступа и разграничение прав.  
Frontend позволяет войти под разными ролями, просматривать товары, управлять пользователями и выполнять демонстрацию RBAC.
