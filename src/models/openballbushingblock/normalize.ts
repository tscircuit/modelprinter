import type { OpenBallBushingBlockShape } from "./validate"

export function normalizeOpenBallBushingBlockProps<
  T extends OpenBallBushingBlockShape,
>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
