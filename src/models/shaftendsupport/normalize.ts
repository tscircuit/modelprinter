import type { ShaftEndSupportShape } from "./validate"

export function normalizeShaftEndSupportProps<T extends ShaftEndSupportShape>(
  p: T,
) {
  return {
    ...p,
    clampThread: p.clampThread.toLowerCase(),
  }
}
