import type { z } from "zod"

export interface CircularBlankShape {
  diameter: number
  thickness: number
  rimRadius: number
}

export function validateCircularBlankProps(
  p: CircularBlankShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.rimRadius >= p.thickness) {
    ctx.addIssue({
      code: "custom",
      path: ["rimRadius"],
      message: "Rim fillet radius exceeds half blank thickness",
    })
  }
  if (2 * p.rimRadius >= p.diameter / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["rimRadius"],
      message: "Rim fillet radius exceeds blank face radius",
    })
  }
}
