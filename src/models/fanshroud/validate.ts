import type { z } from "zod"

export interface FanShroudShape {
  width: number
  height: number
  depth: number
  exitOuterDiameter: number
  wallThickness: number
  holeDiameter: number
  holePitchX: number
  holePitchY: number
  squareToRound: true
}

export function validateFanShroudProps(
  p: FanShroudShape,
  ctx: z.RefinementCtx,
): void {
  if (p.exitOuterDiameter >= Math.min(p.width, p.height) - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["exitOuterDiameter"],
      message: "Tapered round exit OD must be smaller than square inlet",
    })
  }
  if (p.exitOuterDiameter <= 2 * p.wallThickness + 4) {
    ctx.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Shroud wall thickness closes off round exit bore",
    })
  }
  if (
    p.holePitchX + p.holeDiameter >= p.width ||
    p.holePitchY + p.holeDiameter >= p.height
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message: "Corner mounting holes exceed square inlet flange",
    })
  }
}
