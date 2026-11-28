import type { ToggleControlShape } from "./validate"

export function normalizeToggleControlProps<T extends ToggleControlShape>(
  p: T,
) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
