import type { BallBushingBlockShape } from "./validate"

export function normalizeBallBushingBlockProps<T extends BallBushingBlockShape>(
  p: T,
) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
