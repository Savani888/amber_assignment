import { z } from "zod";

export enum QuoteStatus {
  NEW = "New",
  IN_REVIEW = "In Review",
  NEEDS_INFO = "Needs Info",
  COMPLETED = "Completed"
}

export const allowedStatuses = Object.values(QuoteStatus);

export const createQuoteSchema = z.object({
  customer: z.string().trim().min(1, "customer is required"),
  project: z.string().trim().min(1, "project is required"),
  estimatedValue: z.number().min(0, "estimatedValue cannot be negative")
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(QuoteStatus)
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

