import type { z } from "zod"

export interface EnclosureLidShape {
  width: number
  depth: number
  thickness: number
  cornerRadius: number
  rimWidth: number
  rimDepth: number
  holes: number
  holeDiameter: number
  holePitchX: number
  holePitchY: number
}

export function validateEnclosureLidProps(
  p: EnclosureLidShape,
  ctx: z.RefinementCtx,
): void {
  if (p.holePitchX + p.holeDiameter >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message: "Corner clearance X hole pitch exceeds lid width",
    })
  }
  if (p.holePitchY + p.holeDiameter >= p.depth) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchY"],
      message: "Corner clearance Y hole pitch exceeds lid depth",
    })
  }
  if (2 * p.rimWidth >= Math.min(p.width, p.depth) - 10) {
    ctx.addIssue({
      code: "custom",
      path: ["rimWidth"],
      message: "Inset locating rim width leaves insufficient interior opening",
    })
  }
}
