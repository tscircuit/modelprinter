import type { z } from "zod"

export interface CheckerPlateShape {
  length: number
  width: number
  thickness: number
  rise: number
  treadLength: number
  treadWidth: number
  pitchX: number
  pitchY: number
  treadAngle: number
}

export function validateCheckerPlateProps(
  p: CheckerPlateShape,
  ctx: z.RefinementCtx,
): void {
  if (p.treadWidth >= p.treadLength) {
    ctx.addIssue({
      code: "custom",
      path: ["treadWidth"],
      message: "Tread lug width must be narrower than elongated lug length",
    })
  }
  if (p.treadLength >= Math.min(p.pitchX, p.pitchY) - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["treadLength"],
      message: "Raised tread lug length overlaps neighboring pattern cell",
    })
  }
  if (p.rise > p.thickness) {
    ctx.addIssue({
      code: "custom",
      path: ["rise"],
      message: "Tread lug relief height exceeds base plate thickness",
    })
  }
}
