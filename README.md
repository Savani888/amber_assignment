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

Allowed values: `NEW`, `IN_REVIEW`, `NEEDS_INFO`, `COMPLETED`.

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

## Design Questions

Q1. Why separate controllers, services and repositories?
Controllers handle HTTP concerns, services hold business logic, and repositories isolate database access. This keeps each layer easier to test and change.

Q2. If FastAPI takes 30 seconds to respond, should the client wait?
Usually no. I would use a timeout for synchronous requests and move long analysis into a background job with polling or webhook updates.

Q3. Suppose FastAPI returns invalid JSON. How should your backend behave?
It should not save bad data. It should return a `502` integration error, log the request ID, and keep the quote unchanged.

Q4. If there are 500,000 quote requests, how would you improve performance?
Add proper indexes, pagination, selective fields, caching for read-heavy paths, connection pooling, and background workers for expensive analysis.

Q5. Suppose two users update the same quote simultaneously. How would you prevent inconsistent data?
Use transactions and optimistic concurrency with an `updatedAt` or version field. For strict workflows, validate allowed status transitions inside the transaction.

Q6. Would you store every FastAPI analysis or only the latest?
I would store every analysis for auditability and debugging, while returning the latest by default for normal API reads.

Q7. Where would you place business rules?
In services. Controllers should stay thin, repositories should focus on persistence, and database constraints should enforce only durable invariants.

## AI Usage Reflection

1. Yes, AI assistance was used to scaffold and review the implementation.
2. AI was used for project structure, TypeScript implementation, tests, and documentation.
3. The implemented backend behavior, validation rules, error handling, and integration flow are represented directly in this repository.
4. Key design decisions: layered architecture, Prisma with SQLite, mockable FastAPI client, request IDs, pagination, and storing full analysis history.
5. With one more day, I would add Swagger/OpenAPI docs, integration tests against a real FastAPI mock server, authentication, and Docker Compose.
