import type { z } from "zod"

export interface DrawnCupBearingShape {
  innerDiameter: number
  outerDiameter: number
  width: number
  rows: number
  innerRing: number
  cupStyle: "openended" | "closedend"
}

export function validateDrawnCupBearingProps(
  p: DrawnCupBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.innerDiameter >= p.outerDiameter - 2 ||
    p.outerDiameter - p.innerDiameter > 12
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Drawn-cup needle bearing requires a thin radial shell section",
    })
  }
  if (p.width < 5) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Drawn cup width is too short for needle cage retention",
    })
  }
}
