import type { TimingPulleyShape } from "./validate"

export function normalizeTimingPulleyProps<T extends TimingPulleyShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
