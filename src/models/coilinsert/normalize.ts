import type { CoilInsertShape } from "./validate"

export function normalizeCoilInsertProps<T extends CoilInsertShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
