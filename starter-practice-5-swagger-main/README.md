# Демо‑проект к практикам 3–5 (Frontend + Backend)

Этот репозиторий — **заготовка** для практических:
- **Практика 3:** JSON + API + Postman (свой API + внешнее API)
- **Практика 4:** React + API (frontend ↔ backend)
- **Практика 5:** Swagger (OpenAPI) — документация REST API

## Структура
- `backend/` — Express API (CRUD /api/products)
- `frontend/` — React (Vite) клиент
- `docs/student-handout.md` — методичка для студентов

## Быстрый старт
### 1) Backend
```bash
cd backend
npm i
npm run dev
```
API: `http://localhost:3000`

### 2) Frontend (React)
```bash
cd frontend
npm i
npm run dev
```
UI: `http://localhost:3001`

## Проверка API
- Рекомендуется: Postman
- Запасной вариант: `backend/api.http` (VS Code + REST Client)


## Swagger (Практика 5)
Swagger UI доступен по адресу: `http://localhost:3000/api-docs`

Установка зависимостей (backend):
```bash
cd backend
npm i -D swagger-jsdoc swagger-ui-express
```
