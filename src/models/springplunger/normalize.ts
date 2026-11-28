import type { SpringPlungerShape } from "./validate"

export function normalizeSpringPlungerProps<T extends SpringPlungerShape>(
  p: T,
) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
