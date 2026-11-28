import type { CamLatchShape } from "./validate"

export function normalizeCamLatchProps<T extends CamLatchShape>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
