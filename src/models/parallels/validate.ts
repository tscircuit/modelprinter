import type { z } from "zod"

export interface ParallelsShape {
  length: number
  height: number
  thickness: number
  pairGap: number
  edgeRadius: number
}

export function validateParallelsProps(
  p: ParallelsShape,
  ctx: z.RefinementCtx,
): void {
  if (p.thickness >= p.height) {
    ctx.addIssue({
      code: "custom",
      path: ["thickness"],
      message: "Machinist parallel bar thickness must be narrower than height",
    })
  }
  if (2 * p.edgeRadius >= p.thickness) {
    ctx.addIssue({
      code: "custom",
      path: ["edgeRadius"],
      message: "Edge radius consumes ground parallel reference flat",
    })
  }
  if (p.pairGap < p.thickness + 5) {
    ctx.addIssue({
      code: "custom",
      path: ["pairGap"],
      message: "Matched parallel pair center spacing causes bars to collide",
    })
  }
}
