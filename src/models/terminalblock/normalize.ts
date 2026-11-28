import type { TerminalBlockInputShape } from "./validate"

export function normalizeTerminalBlockProps<T extends TerminalBlockInputShape>(
  p: T,
) {
  return {
    ...p,
    width: p.width ?? p.positions * p.pitch,
    screwThread: p.screwThread.toLowerCase(),
  }
}
