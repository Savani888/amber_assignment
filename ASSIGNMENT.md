# Backend Internship Assignment Submission
## Node.js + TypeScript + FastAPI Integration

---

### Section 0: Your Profile Info
- **Your Name:** [Please enter your name here]
- **Phone No:** [Please enter your phone number here]
- **Email id:** [Please enter your email ID here]

---

### Objective & Scenario
The objective is to build a robust backend service using Node.js, TypeScript, Express, and Prisma ORM that manages quote requests, integrates with a FastAPI document analysis service, stores the analysis results, and allows updating the quote status.

---

### API Endpoint Demonstration (Actual Captures)

Below are the actual response payloads captured from running the API locally with the SQLite database.

#### 1. Health Check
- **Endpoint:** `GET /health`
- **Response (200 OK):**
```json
{
  "status": "ok"
}
```

#### 2. Create Quote Request (Validation Enforced)
- **Endpoint:** `POST /quotes`
- **Request Body:**
```json
{
  "customer": "Acme Builders",
  "project": "Warehouse extension",
  "estimatedValue": 125000
}
```
- **Response (201 Created):**
```json
{
  "data": {
    "id": "cmquswd2o0000v4tovgo4sakl",
    "customer": "Acme Builders",
    "project": "Warehouse extension",
    "status": "NEW",
    "estimatedValue": 125000,
    "createdAt": "2026-06-26T10:41:15.313Z",
    "updatedAt": "2026-06-26T10:41:15.313Z"
  }
}
```

#### 3. List Quotes (Paginated with Latest Analysis)
- **Endpoint:** `GET /quotes?page=1&limit=10`
- **Response (200 OK):**
```json
{
  "data": [
    {
      "id": "cmquswd2o0000v4tovgo4sakl",
      "customer": "Acme Builders",
      "project": "Warehouse extension",
      "status": "NEW",
      "estimatedValue": 125000,
      "createdAt": "2026-06-26T10:41:15.313Z",
      "updatedAt": "2026-06-26T10:41:15.313Z",
      "latestAnalysis": null
    },
    {
      "id": "cmqusqy1d0000v4jcirekyk4b",
      "customer": "Acme Builders",
      "project": "Warehouse extension",
      "status": "NEW",
      "estimatedValue": 125000,
      "createdAt": "2026-06-26T10:37:02.546Z",
      "updatedAt": "2026-06-26T10:37:02.546Z",
      "latestAnalysis": {
        "id": "cmqusqy1x0002v4jcc12d1fh7",
        "quoteId": "cmqusqy1d0000v4jcirekyk4b",
        "risk": "Medium",
        "confidence": 0.91,
        "missingItems": [
          "Structural drawings",
          "Load requirements"
        ],
        "rawResponse": {
          "risk": "Medium",
          "missing_items": [
            "Structural drawings",
            "Load requirements"
          ],
          "confidence": 0.91
        },
        "analyzedAt": "2026-06-26T10:37:02.565Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

#### 4. Analyze Quote (Fetches from FastAPI, Stores, and Returns Combined Payload)
- **Endpoint:** `POST /quotes/:id/analyze`
- **Response (201 Created):**
```json
{
  "data": {
    "quote": {
      "id": "cmquswd2o0000v4tovgo4sakl",
      "customer": "Acme Builders",
      "project": "Warehouse extension",
      "status": "NEW",
      "estimatedValue": 125000,
      "createdAt": "2026-06-26T10:41:15.313Z",
      "updatedAt": "2026-06-26T10:41:15.313Z",
      "analyses": []
    },
    "analysis": {
      "id": "cmquswd410002v4toaq4brypf",
      "quoteId": "cmquswd2o0000v4tovgo4sakl",
      "risk": "Medium",
      "confidence": 0.91,
      "missingItems": [
        "Structural drawings",
        "Load requirements"
      ],
      "rawResponse": {
        "risk": "Medium",
        "missing_items": [
          "Structural drawings",
          "Load requirements"
        ],
        "confidence": 0.91
      },
      "analyzedAt": "2026-06-26T10:41:15.362Z"
    }
  }
}
```

#### 5. Get Quote Details (With Full Analysis History)
- **Endpoint:** `GET /quotes/:id`
- **Response (200 OK):**
```json
{
  "data": {
    "id": "cmquswd2o0000v4tovgo4sakl",
    "customer": "Acme Builders",
    "project": "Warehouse extension",
    "status": "NEW",
    "estimatedValue": 125000,
    "createdAt": "2026-06-26T10:41:15.313Z",
    "updatedAt": "2026-06-26T10:41:15.313Z",
    "analyses": [
      {
        "id": "cmquswd410002v4toaq4brypf",
        "quoteId": "cmquswd2o0000v4tovgo4sakl",
        "risk": "Medium",
        "confidence": 0.91,
        "missingItems": [
          "Structural drawings",
          "Load requirements"
        ],
        "rawResponse": {
          "risk": "Medium",
          "missing_items": [
            "Structural drawings",
            "Load requirements"
          ],
          "confidence": 0.91
        },
        "analyzedAt": "2026-06-26T10:41:15.362Z"
      }
    ]
  }
}
```

#### 6. Patch Quote Status
- **Endpoint:** `PATCH /quotes/:id/status`
- **Request Body:**
```json
{
  "status": "IN_REVIEW"
}
```
- **Response (200 OK):**
```json
{
  "data": {
    "id": "cmquswd2o0000v4tovgo4sakl",
    "customer": "Acme Builders",
    "project": "Warehouse extension",
    "status": "IN_REVIEW",
    "estimatedValue": 125000,
    "createdAt": "2026-06-26T10:41:15.313Z",
    "updatedAt": "2026-06-26T10:41:15.387Z"
  }
}
```

#### 7. Validation Error: Negative Estimated Value
- **Endpoint:** `POST /quotes`
- **Request Body:**
```json
{
  "customer": "Acme Builders",
  "project": "Warehouse extension",
  "estimatedValue": -500
}
```
- **Response (400 Bad Request):**
```json
{
  "requestId": "8d85fd14-184d-4bbf-950d-f13d218afc1e",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "formErrors": [],
      "fieldErrors": {
        "estimatedValue": [
          "estimatedValue cannot be negative"
        ]
      }
    }
  }
}
```

#### 8. Validation Error: Invalid Status Value
- **Endpoint:** `PATCH /quotes/:id/status`
- **Request Body:**
```json
{
  "status": "ARCHIVED"
}
```
- **Response (400 Bad Request):**
```json
{
  "requestId": "550f2160-6733-4da6-8bdc-4ed54fd07843",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "formErrors": [],
      "fieldErrors": {
        "status": [
          "Invalid enum value. Expected 'NEW' | 'IN_REVIEW' | 'NEEDS_INFO' | 'COMPLETED', received 'ARCHIVED'"
        ]
      }
    }
  }
}
```

---

### Section 4: Design Questions

#### Q1. Why did you separate controllers, services and repositories?
- **Separation of Concerns:** Controllers handle HTTP requests, headers, query parsing, and response status codes. Services execute business logic, orchestrate integrations, and handle rules. Repositories manage database access, data queries, and persistence.
- **Maintainability & Testing:** Each component can be modified or mocked independently. For instance, testing `QuoteService` business logic is straightforward using a mocked repository, without needing a running database or HTTP server.
- **Flexibility:** If we swap the routing framework (e.g., Express to NestJS) or the database layer (e.g., Prisma to TypeORM), we only need to refactor the controller or repository layer, leaving the core business logic in the service layer completely untouched.

#### Q2. If FastAPI takes 30 seconds to respond, should the client wait? If not, what would you do?
- **No, the client should not wait.** A 30-second synchronous HTTP request blocks resources and increases the likelihood of client timeouts or poor user experience.
- **Asynchronous Task Pattern (Recommended):**
  1. The client triggers the analysis via `POST /quotes/:id/analyze`.
  2. The backend generates a unique background job, marks the quote's status as `IN_REVIEW` or `ANALYZING`, pushes the task to a message queue (e.g., BullMQ with Redis), and immediately returns a `202 Accepted` response with a job status URL.
  3. A background worker picks up the job, calls FastAPI, stores the analysis, and updates the job status to completed.
  4. The client can poll the status endpoint or receive a push notification via WebSockets / Webhooks when the analysis is finished.

#### Q3. Suppose FastAPI returns invalid JSON. How should your backend behave?
- **Fail Gracefully & Protect Database Integrity:** The backend must validate the external API response before committing any changes or saving it.
- **Implementation Strategy:**
  1. We wrap the JSON parsing in a try-catch block.
  2. We validate the parsed JSON against a strict schema (using Zod) to ensure all required fields are present and correctly typed (e.g. validating types of `risk`, `confidence`, and `missing_items`).
  3. If parsing or validation fails, we throw an `InvalidIntegrationResponseError` (502 Bad Gateway), return a clear error response to the client (linked to a unique `requestId` for tracking), and log the incident. The database remains untouched, avoiding corruption.

#### Q4. If there are 500,000 quote requests, how would you improve performance?
- **Database Indexing:** Ensure indexes are created on fields frequently used for filtering or ordering (such as `createdAt`, `status`, and `quoteId`).
- **Pagination & Selective Queries:** Never return all records. Enforce query pagination (already implemented with `page` and `limit`). Use selective column projections to avoid fetching unnecessary large JSON columns (like `rawResponse`) on lists.
- **Caching:** Cache list pages or single quote details using a caching store like Redis, invalidating cache entries when quotes are updated or analyzed.
- **Connection Pooling:** Use connection pooling for database clients to efficiently reuse connections.
- **Offload Heavy Workloads:** Move external integrations and reports creation into asynchronous background processing.

#### Q5. Suppose two users update the same quote simultaneously. How would you prevent inconsistent data?
- **Optimistic Concurrency Control (OCC):** Add a `version` integer column or utilize the `updatedAt` timestamp. When updating a record, check that the version/timestamp matches the value read initially (`WHERE id = :id AND updatedAt = :oldUpdatedAt`). If zero rows are updated, throw a concurrency error.
- **Pessimistic Locking:** Use database transactions with locking (`SELECT FOR UPDATE`). In Prisma, this is done by running raw SQL or using `$transaction` with query locking.
- **State Machine Transitions:** Validate status updates in the service layer against allowed transitions (e.g., a quote cannot transition from `COMPLETED` back to `NEW` without proper permission).

#### Q6. Would you store every FastAPI analysis or only the latest? Explain.
- **Store every analysis (Historical Log / Audit Trail):**
  - **Auditability:** Quote properties (drawings, values) change over time. Storing each analysis version allows tracing how changes to the quote affected its risk score and confidence.
  - **Debugging & Tracking:** Having a historical record enables comparing current results with past runs to detect regressions in the AI model's output.
  - **Implementation:** The schema maps `QuoteRequest` (one) to `AnalysisResult` (many). We get the latest result by default on lists and details (`take: 1` or sorted by date), preserving history without impacting performance.

#### Q7. Where would you place business rules (controller, service or database)? Why?
- **Service Layer (Main Hub):** This is the ideal place for business rules because it keeps rules centralized, readable, and environment-independent.
- **Controller:** Keeps HTTP concerns separate. It should only validate HTTP request syntax.
- **Database:** Excellent for enforcing absolute integrity rules (e.g., unique constraints, cascading deletes) but unsuitable for complex business rules since DB logic is harder to unit-test, version-control, and migrate.

---

### AI Usage Reflection

1. **Did you use AI tools?** Yes, an AI coding assistant was used to scaffold configurations, generate boilerplate tests, and review code implementations.
2. **Which sections used AI?** Scaffolding the repository layout, initial Prisma migration adjustments for SQLite, structuring Vitest unit tests, and structuring the Postman collection schema.
3. **What did you implement yourself?** Custom data normalization logic (handling decimal vs percentage confidence scores from the mock FastAPI), configuring Custom NPM path redirects to avoid host disk capacity issues (`ENOSPC` redirection to D: drive), mapping SQLite schema constraints, and writing the API integration tests.
4. **What design decisions were yours?** The decision to downgrade Prisma from 7.x to 6.x to maintain compatibility with `schema.prisma` datasource configuration, decoupling validation schemas from business models, defining the custom application-level `QuoteStatus` enum to bypass SQLite lack of enum support, and configuring automatic environment variables in Postman requests.
5. **What would you improve if you had one more day?**
   - Implement a real background task runner (e.g. BullMQ with Redis) for `/analyze` to simulate asynchronous document scoring.
   - Set up API documentation using Swagger UI (`swagger-ui-express`).
   - Add JWT-based Authentication / Role-based authorization.
   - Create Docker and Docker Compose files to boot the entire system (Node API + Mock FastAPI + database) in a single command.
