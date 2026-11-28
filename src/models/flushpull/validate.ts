import type { z } from "zod"

export interface FlushPullShape {
  width: number
  height: number
  depth: number
  wallThickness: number
  flangeWidth: number
  cornerRadius: number
  holes: number
  holeDiameter: number
  holePitch: number
}

export function validateFlushPullProps(
  p: FlushPullShape,
  ctx: z.RefinementCtx,
): void {
  if (
    2 * (p.flangeWidth + p.wallThickness) >=
    Math.min(p.width, p.height) - 6
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeWidth"],
      message: "Bezel flange and cup wall close off finger recess",
    })
  }
  if (p.holePitch > p.width - p.holeDiameter - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "End mounting holes break through bezel outer edge",
    })
  }
  if (p.cornerRadius >= Math.min(p.width, p.height) / 3) {
    ctx.addIssue({
      code: "custom",
      path: ["cornerRadius"],
      message: "Corner radius exceeds rectangular bezel proportions",
    })
  }
}
