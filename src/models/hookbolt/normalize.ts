import type { HookBoltShape } from "./validate"

export function normalizeHookBoltProps<T extends HookBoltShape>(p: T) {
  return { ...p, thread: p.thread.toLowerCase() }
}
