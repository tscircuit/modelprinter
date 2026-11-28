import type { z } from "zod"

export interface SquareSectionSealShape {
  innerDiameter: number
  sectionWidth: number
  squareProfile: true
  cornerRadius: number
}

export function validateSquareSectionSealProps(
  p: SquareSectionSealShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.cornerRadius >= p.sectionWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["cornerRadius"],
      message: "Corner fillet radius must leave flat square sealing lands",
    })
  }
}
