import type { WeldStudShape } from "./validate"

export function normalizeWeldStudProps<T extends WeldStudShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
