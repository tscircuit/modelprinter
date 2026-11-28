import type { z } from "zod"

export interface SplitCaseShape {
  width: number
  depth: number
  height: number
  wallThickness: number
  cornerRadius: number
  splitHeight: number
  seamLap: number
  screwOnLid: true
  screws: 4
  screwHoleDiameter: number
  holePitchX: number
  holePitchY: number
}

export function validateSplitCaseProps(
  p: SplitCaseShape,
  ctx: z.RefinementCtx,
): void {
  if (p.wallThickness * 2 >= Math.min(p.width, p.depth)) {
    ctx.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Wall thickness must leave an open interior shell cavity",
    })
  }
  if (
    p.splitHeight <= p.wallThickness + p.seamLap ||
    p.splitHeight >= p.height - p.wallThickness - p.seamLap
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["splitHeight"],
      message:
        "Parting seam height and lap step must stay clear of both shell outer faces",
    })
  }
  if (
    p.holePitchX + p.screwHoleDiameter >= p.width - 2 * p.wallThickness ||
    p.holePitchY + p.screwHoleDiameter >= p.depth - 2 * p.wallThickness
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message: "Corner screw bores must fit inside the interior shell cavity",
    })
  }
}
