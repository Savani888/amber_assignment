import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "./prisma.js";
import { QuoteStatus, type CreateQuoteInput } from "../models/quote.js";

export class QuoteRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  async findMany(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [total, quotes] = await this.db.$transaction([
      this.db.quoteRequest.count(),
      this.db.quoteRequest.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          analyses: {
            orderBy: { analyzedAt: "desc" },
            take: 1
          }
        }
      })
    ]);

    return { total, quotes };
  }

  findById(id: string) {
    return this.db.quoteRequest.findUnique({
      where: { id },
      include: {
        analyses: {
          orderBy: { analyzedAt: "desc" }
        }
      }
    });
  }

  create(data: CreateQuoteInput) {
    return this.db.quoteRequest.create({ data });
  }

  updateStatus(id: string, status: QuoteStatus) {
    return this.db.quoteRequest.update({
      where: { id },
      data: { status }
    });
  }

  createAnalysis(data: Prisma.AnalysisResultUncheckedCreateInput) {
    return this.db.analysisResult.create({ data });
  }
}
