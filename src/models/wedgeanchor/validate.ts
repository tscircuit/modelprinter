import type { z } from "zod"

export interface WedgeAnchorShape {
  threadDiameter: number
  length: number
  threadLength: number
  clipOuterDiameter: number
  clipLength: number
  coneOuterDiameter: number
  coneLength: number
  headless: true
  unset: true
}

export function validateWedgeAnchorProps(
  p: WedgeAnchorShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.threadDiameter > p.clipOuterDiameter ||
    p.threadDiameter > p.coneOuterDiameter
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["clipOuterDiameter"],
      message:
        "Expansion clip and cone diameters must be at least stud diameter",
    })
  }
  if (p.threadLength + p.clipLength + p.coneLength >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "Thread, expansion clip, and cone lengths exceed total stud length",
    })
  }
}
