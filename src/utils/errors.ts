export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, message, "NOT_FOUND");
  }
}

export class IntegrationError extends AppError {
  constructor(message = "Analysis service unavailable", details?: unknown) {
    super(502, message, "FASTAPI_UNAVAILABLE", details);
  }
}

export class InvalidIntegrationResponseError extends AppError {
  constructor(details?: unknown) {
    super(502, "Analysis service returned an invalid response", "FASTAPI_INVALID_RESPONSE", details);
  }
}
