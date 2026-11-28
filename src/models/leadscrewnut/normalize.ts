import type { LeadScrewNutShape } from "./validate"

export function normalizeLeadScrewNutProps<T extends LeadScrewNutShape>(p: T) {
  return {
    ...p,
    trapezoidalThread: p.trapezoidalThread.toLowerCase(),
  }
}
