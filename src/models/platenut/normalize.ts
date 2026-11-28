import type { PlateNutShape } from "./validate"

export function normalizePlateNutProps<T extends PlateNutShape>(p: T) {
  return { ...p, thread: p.thread.toLowerCase() }
}
