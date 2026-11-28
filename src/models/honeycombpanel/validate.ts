import type { z } from "zod"

export interface HoneycombPanelShape {
  length: number
  width: number
  thickness: number
  skinThickness: number
  hexAcrossFlats: number
  coreWallThickness: number
}

export function validateHoneycombPanelProps(
  p: HoneycombPanelShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.skinThickness >= p.thickness) {
    ctx.addIssue({
      code: "custom",
      path: ["skinThickness"],
      message: "Outer skins must leave positive honeycomb core height",
    })
  }
  if (p.coreWallThickness >= p.hexAcrossFlats / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["coreWallThickness"],
      message: "Core cell wall thickness must be less than half hex cell AF",
    })
  }
  if (p.hexAcrossFlats >= Math.min(p.length, p.width)) {
    ctx.addIssue({
      code: "custom",
      path: ["hexAcrossFlats"],
      message: "Hex cell across-flats exceeds panel footprint",
    })
  }
}
