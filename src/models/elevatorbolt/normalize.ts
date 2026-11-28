import type { ElevatorBoltShape } from "./validate"

export function normalizeElevatorBoltProps<T extends ElevatorBoltShape>(p: T) {
  return { ...p, thread: p.thread.toLowerCase() }
}
