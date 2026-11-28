import type { z } from "zod"
import { findIso1207Spec } from "./table"

export interface CheeseHeadScrewShape {
  iso1207: true
  thread: string
  length: number
  slotted: true
}

export function validateCheeseHeadScrewProps(
  p: CheeseHeadScrewShape,
  ctx: z.RefinementCtx,
): void {
  const spec = findIso1207Spec(p.thread)
  if (!spec) {
    ctx.addIssue({
      code: "custom",
      path: ["thread"],
      message: `Unsupported ISO 1207 metric thread "${p.thread}"`,
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
