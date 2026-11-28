import type { z } from "zod"

export interface HitchPinShape {
  custom: true
  diameter: number
  workingLength: number
  bentHead: true
  handleLength: number
  bendRadius: number
  crossHoleDiameter: number
  crossHoleOffset: number
  chamferTip: true
  tipChamfer: number
}

export function validateHitchPinProps(
  p: HitchPinShape,
  ctx: z.RefinementCtx,
): void {
  if (p.crossHoleDiameter >= p.diameter * 0.75) {
    ctx.addIssue({
      code: "custom",
      path: ["crossHoleDiameter"],
      message:
        "Cross-hole diameter must remain smaller than 75% of shank diameter",
    })
  }
  if (p.tipChamfer >= p.diameter / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["tipChamfer"],
      message: "Tip chamfer must be smaller than the shank radius",
    })
  }
  if (p.crossHoleOffset <= p.crossHoleDiameter / 2 + p.tipChamfer) {
    ctx.addIssue({
      code: "custom",
      path: ["crossHoleOffset"],
      message: "Cross-hole offset from tip must clear the tip chamfer",
    })
  }
  if (p.crossHoleOffset >= p.workingLength - p.crossHoleDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["crossHoleOffset"],
      message: "Cross-hole must lie within the straight working shank",
    })
  }
  if (p.bendRadius < p.diameter / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["bendRadius"],
      message:
        "Centerline bend radius must be at least half the shank diameter",
    })
  }
}
