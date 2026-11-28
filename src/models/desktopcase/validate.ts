import type { z } from "zod"

export interface DesktopCaseShape {
  width: number
  depth: number
  height: number
  wallThickness: number
  cornerRadius: number
  bezelDepth: number
  bottomScrewLid: true
  screws: number
  holePitchX: number
  holePitchY: number
}

export function validateDesktopCaseProps(
  p: DesktopCaseShape,
  ctx: z.RefinementCtx,
): void {
  if (p.holePitchX >= p.width - 2 * p.wallThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message: "Bottom screw X pitch exceeds interior desktop case width",
    })
  }
  if (p.holePitchY >= p.depth - 2 * p.wallThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchY"],
      message: "Bottom screw Y pitch exceeds interior desktop case depth",
    })
  }
  if (p.bezelDepth >= p.depth / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["bezelDepth"],
      message: "Front bezel lip depth cannot exceed half of case depth",
    })
  }
}
