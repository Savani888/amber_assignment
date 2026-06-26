import { z } from "zod";
import { env } from "../config/env.js";
import { IntegrationError, InvalidIntegrationResponseError } from "../utils/errors.js";

const analysisResponseSchema = z.object({
  risk: z.string().min(1),
  missing_items: z.array(z.string()),
  confidence: z.number().min(0).max(100)
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;

export interface AnalysisClient {
  analyze(quoteId: string): Promise<AnalysisResponse>;
}

export class FastApiClient implements AnalysisClient {
  constructor(
    private readonly baseUrl = env.fastApiBaseUrl,
    private readonly timeoutMs = env.fastApiTimeoutMs
  ) {}

  async analyze(quoteId: string): Promise<AnalysisResponse> {
    if (this.baseUrl.startsWith("mock://")) {
      return {
        risk: "Medium",
        missing_items: ["Structural drawings", "Load requirements"],
        confidence: 0.91 // Matches the normalized decimal form stored in the database
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl.replace(/\/$/, "")}/analyze`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ quote_id: quoteId }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new IntegrationError(`Analysis service failed with status ${response.status}`);
      }

      let payload: unknown;
      try {
        payload = await response.json();
      } catch (error) {
        throw new InvalidIntegrationResponseError(error);
      }

      const parsed = analysisResponseSchema.safeParse(payload);
      if (!parsed.success) {
        throw new InvalidIntegrationResponseError(parsed.error.flatten());
      }

      const data = parsed.data;
      return {
        risk: data.risk,
        missing_items: data.missing_items,
        confidence: data.confidence > 1 ? data.confidence / 100 : data.confidence
      };
    } catch (error) {
      if (error instanceof IntegrationError || error instanceof InvalidIntegrationResponseError) {
        throw error;
      }

      throw new IntegrationError("Analysis service unavailable", error);
    } finally {
      clearTimeout(timeout);
    }
  }
}
