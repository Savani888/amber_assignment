# Backend Internship Assignment

Node.js + TypeScript + Express API for managing quote requests and integrating with a FastAPI document analysis service.

## Tech Stack

- Node.js, TypeScript, Express
- Prisma ORM
- SQLite by default
- Zod validation
- Vitest unit tests

## Setup

```bash
cp .env.example .env
npm install
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

The API runs at `http://localhost:3000`.

## Environment

```env
DATABASE_URL="file:./dev.db"
PORT=3000
FASTAPI_BASE_URL="mock://fastapi"
FASTAPI_TIMEOUT_MS=5000
```

Use `mock://fastapi` to return the assignment sample analysis response locally. For a real FastAPI app, set `FASTAPI_BASE_URL` to the service base URL, for example `http://localhost:8000`.

## API Documentation

### Health Check

```http
GET /health
```

### List Quotes

```http
GET /quotes?page=1&limit=10
```

Returns paginated quotes with their latest analysis result.

### Get Quote

```http
GET /quotes/:id
```

Returns quote details with analysis history.

### Create Quote

```http
POST /quotes
Content-Type: application/json

{
  "customer": "Acme Builders",
  "project": "Warehouse extension",
  "estimatedValue": 125000
}
```

Validation rejects missing customer, missing project, and negative estimated values.

### Analyze Quote

```http
POST /quotes/:id/analyze
```

Flow:

1. Find quote.
2. Call FastAPI `POST /analyze` with `{ "quote_id": "..." }`.
3. Store analysis result.
4. Return quote and analysis together.

### Update Quote Status

```http
PATCH /quotes/:id/status
Content-Type: application/json

{
  "status": "IN_REVIEW"
}
```

Allowed values: `New`, `In Review`, `Needs Info`, `Completed`.
Internally stored as enum: `NEW`, `IN_REVIEW`, `NEEDS_INFO`, `COMPLETED`.
## Example cURL

```bash
curl -X POST http://localhost:3000/quotes \
  -H "content-type: application/json" \
  -d "{\"customer\":\"Acme Builders\",\"project\":\"Warehouse extension\",\"estimatedValue\":125000}"
```

```bash
curl -X POST http://localhost:3000/quotes/QUOTE_ID/analyze
```

```bash
curl -X PATCH http://localhost:3000/quotes/QUOTE_ID/status \
  -H "content-type: application/json" \
  -d "{\"status\":\"COMPLETED\"}"
```

## Error Handling

Errors include `requestId` and a structured error body. The API handles:

- Quote not found
- Invalid request body
- FastAPI unavailable
- Invalid FastAPI JSON or schema
- Database failures

## Bonus Items Implemented

- Pagination for `GET /quotes`
- Request ID middleware using `x-request-id`
- Unit tests

