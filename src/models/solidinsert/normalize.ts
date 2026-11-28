import type { SolidInsertShape } from "./validate"

export function normalizeSolidInsertProps<T extends SolidInsertShape>(p: T) {
  return {
    ...p,
    internalThread: p.internalThread.toLowerCase(),
  }
}
