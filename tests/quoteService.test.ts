import { describe, expect, it, vi } from "vitest";
import { QuoteStatus } from "../src/models/quote.js";
import { QuoteService } from "../src/services/quoteService.js";
import { NotFoundError } from "../src/utils/errors.js";

const sampleQuote = {
  id: "quote_1",
  customer: "Acme Builders",
  project: "Warehouse extension",
  status: QuoteStatus.NEW,
  estimatedValue: 125000,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  analyses: []
};

describe("QuoteService", () => {
  it("stores FastAPI analysis and returns the combined response", async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue(sampleQuote),
      createAnalysis: vi.fn().mockResolvedValue({
        id: "analysis_1",
        quote_id: "quote_1",
        risk: "Medium",
        confidence: 0.91,
        missing_items: ["Structural drawings"],
        rawResponse: {},
        analyzed_at: new Date("2026-01-01T00:00:00.000Z")
      })
    };
    const client = {
      analyze: vi.fn().mockResolvedValue({
        risk: "Medium",
        missing_items: ["Structural drawings"],
        confidence: 0.91
      })
    };

    const service = new QuoteService(repository as never, client);
    const result = await service.analyzeQuote("quote_1");

    expect(client.analyze).toHaveBeenCalledWith("quote_1");
    expect(repository.createAnalysis).toHaveBeenCalledWith({
      quote_id: "quote_1",
      risk: "Medium",
      confidence: 0.91,
      missing_items: ["Structural drawings"],
      rawResponse: {
        risk: "Medium",
        missing_items: ["Structural drawings"],
        confidence: 0.91
      }
    });
    expect(result.quote.id).toBe("quote_1");
    expect(result.analysis.risk).toBe("Medium");
  });

  it("throws not found when analyzing a missing quote", async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue(null)
    };
    const client = {
      analyze: vi.fn()
    };
    const service = new QuoteService(repository as never, client);

    await expect(service.analyzeQuote("missing")).rejects.toBeInstanceOf(NotFoundError);
    expect(client.analyze).not.toHaveBeenCalled();
  });
});
