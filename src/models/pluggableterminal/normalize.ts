import type { PluggableTerminalShape } from "./validate"

export function normalizePluggableTerminalProps<
  T extends PluggableTerminalShape,
>(p: T) {
  return {
    ...p,
    screwThread: p.screwThread.toLowerCase(),
  }
}
