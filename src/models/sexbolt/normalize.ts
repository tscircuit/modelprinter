import type { SexBoltShape } from "./validate"

export function normalizeSexBoltProps<T extends SexBoltShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
