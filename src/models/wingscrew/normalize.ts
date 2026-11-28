import type { WingScrewShape } from "./validate"

export function normalizeWingScrewProps<T extends WingScrewShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
