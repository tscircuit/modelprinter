import type { z } from "zod"

export interface FlangeBoxShape {
  width: number
  depth: number
  height: number
  wallThickness: number
  flangeProjection: number
  flangeThickness: number
  flangeHoles: 4
  flangeHoleDiameter: number
  holePitchX: number
  holePitchY: number
  screwOnLid: true
  lidScrews: 4
}

export function validateFlangeBoxProps(
  p: FlangeBoxShape,
  ctx: z.RefinementCtx,
): void {
  if (p.wallThickness * 2 >= Math.min(p.width, p.depth)) {
    ctx.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Wall thickness must leave an open interior cavity",
    })
  }
  if (p.flangeThickness >= p.height) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeThickness"],
      message: "End mounting flange thickness must be smaller than box height",
    })
  }
  const overallWidth = p.width + 2 * p.flangeProjection
  if (
    p.holePitchX <= p.width + p.flangeHoleDiameter ||
    p.holePitchX + p.flangeHoleDiameter >= overallWidth
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message:
        "Flange hole X pitch must place holes on the outward mounting flanges with edge clearance",
    })
  }
  if (p.holePitchY + p.flangeHoleDiameter >= p.depth) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchY"],
      message: "Flange hole Y pitch must fit within the flange depth",
    })
  }
}
