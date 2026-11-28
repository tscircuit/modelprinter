import type { RelayBaseShape } from "./validate"

export function normalizeRelayBaseProps<T extends RelayBaseShape>(p: T) {
  return {
    ...p,
    screwThread: p.screwThread.toLowerCase(),
  }
}
