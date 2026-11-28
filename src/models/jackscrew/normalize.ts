import type { JackScrewShape } from "./validate"

export function normalizeJackScrewProps<T extends JackScrewShape>(p: T) {
  return { ...p, thread: p.thread.toLowerCase() }
}
