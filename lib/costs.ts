// Cost calculator for OpenAI models used in the app

export type ModelPricing = {
  inputPer1K: number; // USD per 1K input tokens
  outputPer1K: number; // USD per 1K output tokens
};

const PRICING: Record<string, ModelPricing> = {
  "gpt-3.5-turbo": { inputPer1K: 0.0005, outputPer1K: 0.0015 },
};

export function calculateOpenAICost(
  model: string,
  promptTokens: number,
  completionTokens: number
): {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  pricingKnown: boolean;
} {
  const pricing = PRICING[model];
  if (!pricing) {
    return { inputCost: 0, outputCost: 0, totalCost: 0, pricingKnown: false };
  }

  const inputCost = (promptTokens / 1000) * pricing.inputPer1K;
  const outputCost = (completionTokens / 1000) * pricing.outputPer1K;
  const totalCost = inputCost + outputCost;

  return { inputCost, outputCost, totalCost, pricingKnown: true };
}