import type { z } from "zod"

export interface ConicalSpringShape {
  custom: true
  outerDiameter: number
  endOuterDiameter: number
  wireDiameter: number
  length: number
  turns: number
  activeTurns: number
  closedEnds: true
  handedness: "right" | "left"
  freeState: true
}

export function validateConicalSpringProps(
  p: ConicalSpringShape,
  ctx: z.RefinementCtx,
): void {
  if (p.endOuterDiameter >= p.outerDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["endOuterDiameter"],
      message: "Tapered small-end OD must be smaller than base OD",
    })
  }
  if (p.endOuterDiameter <= 2 * p.wireDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["endOuterDiameter"],
      message: "Small-end OD must leave a positive inner clearance bore",
    })
  }
  if (p.activeTurns >= p.turns) {
    ctx.addIssue({
      code: "custom",
      path: ["activeTurns"],
      message: "Active turns must be fewer than total turns for closed ends",
    })
  }
  if (p.turns * p.wireDiameter >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["length"],
      message: "Free length must exceed solid coil height",
    })
  }
}
