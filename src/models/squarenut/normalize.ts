import type { SquareNutShape } from "./validate"

export function normalizeSquareNutProps<T extends SquareNutShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
