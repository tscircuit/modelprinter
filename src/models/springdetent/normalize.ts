import type { SpringDetentShape } from "./validate"

export function normalizeSpringDetentProps<T extends SpringDetentShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
