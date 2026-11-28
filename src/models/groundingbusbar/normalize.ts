import type { GroundingBusbarShape } from "./validate"

export function normalizeGroundingBusbarProps<T extends GroundingBusbarShape>(
  p: T,
) {
  return {
    ...p,
    screwThread: p.screwThread.toLowerCase(),
  }
}
