import { Router } from "express";
import { QuoteController } from "../controllers/quoteController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export function quoteRoutes(controller = new QuoteController()) {
  const router = Router();

  router.get("/", asyncHandler(controller.list));
  router.post("/", asyncHandler(controller.create));
  router.get("/:id", asyncHandler(controller.get));
  router.post("/:id/analyze", asyncHandler(controller.analyze));
  router.patch("/:id/status", asyncHandler(controller.updateStatus));

  return router;
}
