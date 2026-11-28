import type { z } from "zod"

export interface ShelfSplitSleeveShape {
  innerDiameter: number
  height: number
  bottomOuterDiameter: number
  topOuterDiameter: number
  ridgeHeight: number
  ridgeWidth: number
  ridgeZ: number
  seamTabs: number
  tabWidth: number
  tabHeight: number
}

export function validateShelfSplitSleeveProps(
  p: ShelfSplitSleeveShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.innerDiameter >= p.topOuterDiameter - 2 ||
    p.topOuterDiameter > p.bottomOuterDiameter
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["topOuterDiameter"],
      message:
        "Tapered split sleeve requires innerDiameter < topOuterDiameter <= bottomOuterDiameter",
    })
  }
  if (p.ridgeZ <= p.ridgeWidth || p.ridgeZ >= p.height - p.ridgeWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["ridgeZ"],
      message: "Internal locating ridge offset lies outside sleeve height",
    })
  }
}
