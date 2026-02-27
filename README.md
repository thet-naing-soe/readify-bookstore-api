# Readify Bookstore API

A simple, production-ready RESTful API for an online bookstore.

## Quick Start

```bash
git clone https://github.com/thet-naing-soe/readify-bookstore-api.git
cd readify-bookstore-api
npm install
cp .env.example .env
npm run dev
```

- API: http://localhost:3000/api/v1
- Swagger UI: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/health

## Endpoints

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| GET    | /api/v1/books       | List all books        |
| POST   | /api/v1/books       | Create a book         |
| GET    | /api/v1/books/:id   | Get a book            |
| PUT    | /api/v1/books/:id   | Full update           |
| PATCH  | /api/v1/books/:id   | Partial update        |
| DELETE | /api/v1/books/:id   | Delete a book         |
| GET    | /api/v1/authors     | List all authors      |
| GET    | /api/v1/authors/:id | Get author with books |

## Testing

```bash
# Run unit tests
npm test
```

For manual testing, import `tests/api-collections/bookstore.collection.json`
into [Hoppscotch](https://hoppscotch.io).

## Architecture

This project follows the **MVC pattern**:

- **Routes** — Map URLs to controllers
- **Controllers** — Handle requests and responses
- **Models** — Manage in-memory data storage
- **Middleware** — Logging, validation, error handling

> In-memory storage is used for simplicity.
> Swap the Model layer with PostgreSQL or MongoDB for production.

## CI/CD

Automated via GitHub Actions on every push:

1. Install dependencies and run security audit
2. Run tests
3. Deploy to **staging** on `develop` branch
4. Deploy to **production** on `main` branch

## Tech Stack

| Tool              | Purpose            |
| ----------------- | ------------------ |
| Express           | Web framework      |
| Winston           | Logging            |
| OpenAPI / Swagger | API documentation  |
| Jest              | Unit testing       |
| Hoppscotch        | Manual API testing |
| GitHub Actions    | CI/CD pipeline     |

## License

MIT
