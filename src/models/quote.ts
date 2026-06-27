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

const statusAliases: Record<string, QuoteStatus> = {
  NEW: QuoteStatus.NEW,
  IN_REVIEW: QuoteStatus.IN_REVIEW,
  NEEDS_INFO: QuoteStatus.NEEDS_INFO,
  COMPLETED: QuoteStatus.COMPLETED
};

export const updateStatusSchema = z.object({
  status: z.string().transform((raw, ctx) => {
    const normalized = raw.trim().toUpperCase().replace(/\s+/g, "_");
    const mapped = statusAliases[normalized];

    if (mapped) {
      return mapped;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "status must be one of NEW, IN_REVIEW, NEEDS_INFO, COMPLETED"
    });
    return z.NEVER;
  })
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
