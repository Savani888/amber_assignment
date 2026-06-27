import { QuoteStatus } from "../models/quote.js";
import { QuoteRepository } from "../repositories/quoteRepository.js";
import type { AnalysisClient } from "./fastApiClient.js";
import { FastApiClient } from "./fastApiClient.js";
import type { CreateQuoteInput } from "../models/quote.js";
import { NotFoundError } from "../utils/errors.js";

export class QuoteService {
  constructor(
    private readonly quotes = new QuoteRepository(),
    private readonly analysisClient: AnalysisClient = new FastApiClient()
  ) {}

  async listQuotes(page: number, limit: number) {
    const { total, quotes } = await this.quotes.findMany(page, limit);

    return {
      data: quotes.map((quote) => ({
        ...quote,
        latestAnalysis: quote.analyses[0] ?? null,
        analyses: undefined
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getQuote(id: string) {
    const quote = await this.quotes.findById(id);
    if (!quote) {
      throw new NotFoundError("Quote not found");
    }
    return quote;
  }

  createQuote(input: CreateQuoteInput) {
    return this.quotes.create(input);
  }

  async analyzeQuote(id: string) {
    const quote = await this.quotes.findById(id);
    if (!quote) {
      throw new NotFoundError("Quote not found");
    }

    const analysis = await this.analysisClient.analyze(id);
    const storedAnalysis = await this.quotes.createAnalysis({
      quote_id: id,
      risk: analysis.risk,
      confidence: analysis.confidence,
      missing_items: analysis.missing_items,
      rawResponse: analysis
    });

    return {
      quote,
      analysis: storedAnalysis
    };
  }

  async updateStatus(id: string, status: QuoteStatus) {
    await this.getQuote(id);
    return this.quotes.updateStatus(id, status);
  }
}
