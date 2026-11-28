import type { z } from "zod"

export interface SquareWasherShape {
  custom: true
  innerDiameter: number
  width: number
  length: number
  height: number
  centeredHole: true
  squareCorners: true
}

export function validateSquareWasherProps(
  p: SquareWasherShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= Math.min(p.width, p.length) - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Centered bore diameter must leave at least 1 mm edge margin",
    })
  }
}
