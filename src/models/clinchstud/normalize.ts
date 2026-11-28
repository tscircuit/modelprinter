import type { ClinchStudShape } from "./validate"

export function normalizeClinchStudProps<T extends ClinchStudShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
