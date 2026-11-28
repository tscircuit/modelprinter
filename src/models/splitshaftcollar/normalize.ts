import type { SplitShaftCollarShape } from "./validate"

export function normalizeSplitShaftCollarProps<T extends SplitShaftCollarShape>(
  p: T,
) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
