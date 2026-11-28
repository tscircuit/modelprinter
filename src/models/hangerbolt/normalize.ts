import type { HangerBoltShape } from "./validate"

export function normalizeHangerBoltProps<T extends HangerBoltShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
