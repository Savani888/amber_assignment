import { PrismaClient } from "@prisma/client";
import { QuoteStatus } from "../src/models/quote.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.analysisResult.deleteMany();
  await prisma.quoteRequest.deleteMany();

  const quote = await prisma.quoteRequest.create({
    data: {
      customer: "Acme Builders",
      project: "Warehouse extension",
      status: QuoteStatus.NEW,
      estimatedValue: 125000
    }
  });

  await prisma.analysisResult.create({
    data: {
      quoteId: quote.id,
      risk: "Medium",
      confidence: 0.91,
      missingItems: ["Structural drawings", "Load requirements"],
      rawResponse: {
        risk: "Medium",
        missing_items: ["Structural drawings", "Load requirements"],
        confidence: 0.91
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
