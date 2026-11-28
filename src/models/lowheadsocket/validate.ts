import type { z } from "zod"
import { findDin7984Spec } from "./table"

export interface LowHeadSocketShape {
  din7984: true
  thread: string
  length: number
  hexSocket: true
}

export function validateLowHeadSocketProps(
  p: LowHeadSocketShape,
  ctx: z.RefinementCtx,
): void {
  const spec = findDin7984Spec(p.thread)
  if (!spec) {
    ctx.addIssue({
      code: "custom",
      path: ["thread"],
      message: `Unsupported DIN 7984 metric thread "${p.thread}"`,
    })
    return
  }
  if (p.length < 2 * spec.threadPitch) {
    ctx.addIssue({
      code: "custom",
      path: ["length"],
      message: "Under-head length must accommodate at least two thread pitches",
    })
  }
}
