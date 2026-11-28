import type { DoubleEndedStudShape } from "./validate"

export function normalizeDoubleEndedStudProps<T extends DoubleEndedStudShape>(
  p: T,
) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
