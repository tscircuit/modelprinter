import type { EyeNutShape } from "./validate"

export function normalizeEyeNutProps<T extends EyeNutShape>(p: T) {
  return { ...p, thread: p.thread.toLowerCase() }
}
