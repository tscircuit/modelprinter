import type { FuseHolderShape } from "./validate"

export function normalizeFuseHolderProps<T extends FuseHolderShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
