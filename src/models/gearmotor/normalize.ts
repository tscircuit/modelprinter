import type { GearMotorShape } from "./validate"

export function normalizeGearMotorProps<T extends GearMotorShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
