import type { SquareHeadBoltShape } from "./validate"

export function normalizeSquareHeadBoltProps<T extends SquareHeadBoltShape>(
  p: T,
) {
  return { ...p, thread: p.thread.toLowerCase() }
}
