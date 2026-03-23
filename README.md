# Практическая работа 5 по дисциплине «Фронтенд и бэкенд разработка»

## Информация о работе

В данной ветке представлено решение практической работы №5 по дисциплине «Фронтенд и бэкенд разработка».

Цель работы — документирование REST API с использованием Swagger (OpenAPI), а также проверка маршрутов через Swagger UI.  
Дополнительно в проекте сохранено полностью рабочее frontend-приложение, подключённое к backend API.

## Что реализовано

В ходе выполнения практической работы были реализованы:

- подключение Swagger UI к Express-приложению;
- генерация OpenAPI-описания на основе JSDoc-аннотаций;
- документирование CRUD-маршрутов `/api/products`;
- описание схемы объекта товара;
- описание параметров, тела запроса и ответов сервера;
- проверка API через интерфейс Swagger UI;
- рабочее React-приложение для просмотра, добавления, редактирования и удаления товаров.

## Структура проекта

- `backend/` — Express API с маршрутом `/api/products`
- `frontend/` — React-приложение, работающее с API
- `docs/student-handout.md` — методические указания
- `README.md` — описание выполненной работы

## Используемые технологии

### Backend
- Node.js
- Express
- CORS
- nanoid
- swagger-jsdoc
- swagger-ui-express
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

После запуска сервер будет доступен по адресу:

```text
http://localhost:3000
```

## Swagger UI

Swagger UI доступен по адресу:

```text
http://localhost:3000/api-docs
```

Через интерфейс Swagger UI можно проверить:

- получение списка товаров;
- получение товара по id;
- создание нового товара;
- частичное обновление товара;
- удаление товара.

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

## Примеры маршрутов API

### Получить список товаров

```http
GET /api/products
```

### Получить товар по id

```http
GET /api/products/:id
```

### Создать товар

```http
POST /api/products
Content-Type: application/json
```

Пример тела запроса:

```json
{
  "title": "Ноутбук",
  "category": "Электроника",
  "description": "Ультрабук для учёбы и работы",
  "price": 64990,
  "stock": 5,
  "rating": 4.8,
  "imageUrl": ""
}
```

### Обновить товар

```http
PATCH /api/products/:id
Content-Type: application/json
```

Пример тела запроса:

```json
{
  "price": 62990,
  "stock": 4
}
```

### Удалить товар

```http
DELETE /api/products/:id
```

## Результат

В данной ветке представлено завершённое решение практической работы №5.  
Backend API полностью документирован через Swagger UI.  
Frontend-приложение подключено к API и поддерживает основные CRUD-операции.  
Проект готов к проверке и демонстрации.
