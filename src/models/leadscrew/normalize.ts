import type { LeadScrewShape } from "./validate"

export function normalizeLeadScrewProps<T extends LeadScrewShape>(p: T) {
  return {
    ...p,
    trapezoidalThread: p.trapezoidalThread.toLowerCase(),
  }
}
