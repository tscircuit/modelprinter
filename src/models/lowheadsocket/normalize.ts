import type { LowHeadSocketShape } from "./validate"

export function normalizeLowHeadSocketProps<T extends LowHeadSocketShape>(
  p: T,
) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
