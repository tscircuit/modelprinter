import type { TerminalBarrierShape } from "./validate"

export function normalizeTerminalBarrierProps<T extends TerminalBarrierShape>(
  p: T,
) {
  return {
    ...p,
    screwThread: p.screwThread.toLowerCase(),
  }
}
