import type { z } from "zod"

export interface BarrelNutShape {
  threadDiameter: number
  outerDiameter: number
  length: number
  holeOffset: number
  slotWidth: number
  slotDepth: number
  transverse: true
  slotted: true
}

export function validateBarrelNutProps(
  p: BarrelNutShape,
  ctx: z.RefinementCtx,
): void {
  if (p.threadDiameter >= p.outerDiameter - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["threadDiameter"],
      message: "Transverse thread bore exceeds cross-dowel outer diameter",
    })
  }
  if (
    p.holeOffset <= p.threadDiameter / 2 + 1 ||
    p.holeOffset >= p.length - p.threadDiameter / 2 - 1
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holeOffset"],
      message: "Transverse thread offset breaks through dowel end face",
    })
  }
  if (
    p.slotWidth >= p.outerDiameter * 0.5 ||
    p.slotDepth >= p.holeOffset - p.threadDiameter / 2
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["slotDepth"],
      message: "Alignment screwdriver slot intersects transverse thread bore",
    })
  }
}
