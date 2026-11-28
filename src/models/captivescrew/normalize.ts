import type { CaptiveScrewShape } from "./validate"

export function normalizeCaptiveScrewProps<T extends CaptiveScrewShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
