import { describe, expect, it } from "vitest";
import { createQuoteSchema, updateStatusSchema } from "../src/models/quote.js";

describe("quote validation", () => {
  it("rejects negative estimated values", () => {
    const result = createQuoteSchema.safeParse({
      customer: "Acme",
      project: "Warehouse",
      estimatedValue: -10
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid status values", () => {
    const result = updateStatusSchema.safeParse({ status: "ARCHIVED" });

    expect(result.success).toBe(false);
  });
});
