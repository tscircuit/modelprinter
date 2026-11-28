import type { ThumbScrewShape } from "./validate"

export function normalizeThumbScrewProps<T extends ThumbScrewShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
