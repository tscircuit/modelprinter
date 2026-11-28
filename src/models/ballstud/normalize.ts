import type { BallStudShape } from "./validate"

export function normalizeBallStudProps<T extends BallStudShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
