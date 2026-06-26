import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 3000),
  fastApiBaseUrl: process.env.FASTAPI_BASE_URL ?? "mock://fastapi",
  fastApiTimeoutMs: Number(process.env.FASTAPI_TIMEOUT_MS ?? 5000)
};
