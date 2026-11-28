import type { z } from "zod"

export interface FlangeBearingShape {
  boreDiameter: number
  width: number
  height: number
  depth: number
  face4Hole: true
  holeGridX: number
  holeGridY: number
  holeDiameter: number
}

export function validateFlangeBearingProps(
  p: FlangeBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.holeGridX + p.holeDiameter >= p.width ||
    p.holeGridY + p.holeDiameter >= p.height
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holeGridX"],
      message:
        "Four-bolt flange hole grid plus hole diameter must stay inside the housing plate",
    })
  }
  const boltDiagonalRadius = Math.hypot(p.holeGridX / 2, p.holeGridY / 2)
  if (
    p.boreDiameter >= p.width * 0.65 ||
    p.boreDiameter >= p.height * 0.65 ||
    p.boreDiameter / 2 + p.holeDiameter / 2 >= boltDiagonalRadius
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message:
        "Shaft bore must clear the four-bolt corner mounting holes and housing hub",
    })
  }
}
