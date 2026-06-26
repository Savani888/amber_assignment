import express from "express";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { quoteRoutes } from "./routes/quoteRoutes.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestIdMiddleware);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/quotes", quoteRoutes());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
