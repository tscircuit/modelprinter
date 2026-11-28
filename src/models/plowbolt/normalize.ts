import type { PlowBoltShape } from "./validate"

export function normalizePlowBoltProps<T extends PlowBoltShape>(p: T) {
  return { ...p, thread: p.thread.toLowerCase() }
}
