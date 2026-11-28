import type { z } from "zod"

export interface TriangularBarShape {
  sideLength: number
  length: number
  equilateral: true
  cornerRadius: number
}

export function validateTriangularBarProps(
  p: TriangularBarShape,
  ctx: z.RefinementCtx,
): void {
  const inradius = (p.sideLength * Math.sqrt(3)) / 6
  if (p.cornerRadius >= inradius * 0.8) {
    ctx.addIssue({
      code: "custom",
      path: ["cornerRadius"],
      message: "Corner fillet radius eliminates flat triangular faces",
    })
  }
}
