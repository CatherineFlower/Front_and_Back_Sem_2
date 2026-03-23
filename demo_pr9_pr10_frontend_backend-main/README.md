# Практические работы 9–10 по дисциплине «Фронтенд и бэкенд разработка»

## Информация о работе

В данной ветке представлено решение практических работ №9 и №10 по дисциплине «Фронтенд и бэкенд разработка».

Практическая работа №9 посвящена реализации refresh token и endpoint для обновления JWT access token.  
Практическая работа №10 посвящена подключению refresh-механизма на frontend с использованием axios interceptors и автоматическим повтором запроса после `401 Unauthorized`.

## Что реализовано

В ходе выполнения работы были реализованы:

- регистрация пользователя;
- вход пользователя с получением пары токенов: `accessToken` и `refreshToken`;
- endpoint `POST /api/auth/refresh` для получения новой пары токенов;
- хранение access и refresh токенов в `localStorage`;
- `axios` request interceptor для автоматической подстановки Bearer access token;
- `axios` response interceptor для автоматического вызова `/auth/refresh` при `401`;
- повтор исходного запроса после успешного обновления токенов;
- защищённый маршрут `GET /api/products`;
- Swagger UI для проверки маршрутов.

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
- `POST /api/auth/refresh`

### Защищённые данные
- `GET /api/products`

## Результат

Ветка содержит завершённое решение практических работ №9 и №10.  
Backend реализует refresh token и обновление пары JWT-токенов.  
Frontend автоматически обновляет access token при `401` и повторяет исходный запрос без участия пользователя.