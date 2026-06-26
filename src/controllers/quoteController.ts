import type { Request, Response } from "express";
import { QuoteService } from "../services/quoteService.js";
import { createQuoteSchema, paginationSchema, updateStatusSchema } from "../models/quote.js";

export class QuoteController {
  constructor(private readonly service = new QuoteService()) {}

  list = async (req: Request, res: Response) => {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = await this.service.listQuotes(page, limit);
    res.json(result);
  };

  get = async (req: Request, res: Response) => {
    const quote = await this.service.getQuote(req.params.id);
    res.json({ data: quote });
  };

  create = async (req: Request, res: Response) => {
    const input = createQuoteSchema.parse(req.body);
    const quote = await this.service.createQuote(input);
    res.status(201).json({ data: quote });
  };

  analyze = async (req: Request, res: Response) => {
    const result = await this.service.analyzeQuote(req.params.id);
    res.status(201).json({ data: result });
  };

  updateStatus = async (req: Request, res: Response) => {
    const { status } = updateStatusSchema.parse(req.body);
    const quote = await this.service.updateStatus(req.params.id, status);
    res.json({ data: quote });
  };
}
