import type { z } from "zod"

export interface FanFilterShape {
  width: number
  height: number
  depth: number
  frameThickness: number
  mediaWidth: number
  mediaHeight: number
  mediaThickness: number
  grillePitch: number
  holeDiameter: number
  holePitchX: number
  holePitchY: number
}

export function validateFanFilterProps(
  p: FanFilterShape,
  ctx: z.RefinementCtx,
): void {
  if (p.mediaWidth > p.width - 2 * p.frameThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["mediaWidth"],
      message: "Filter media pad width exceeds cassette inner frame opening",
    })
  }
  if (p.mediaHeight > p.height - 2 * p.frameThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["mediaHeight"],
      message: "Filter media pad height exceeds cassette inner frame opening",
    })
  }
  if (p.mediaThickness >= p.depth) {
    ctx.addIssue({
      code: "custom",
      path: ["mediaThickness"],
      message: "Filter media pad thickness must fit inside cassette depth",
    })
  }
  if (
    p.holePitchX + p.holeDiameter >= p.width ||
    p.holePitchY + p.holeDiameter >= p.height
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message: "Corner mounting holes exceed outer filter cassette dimensions",
    })
  }
}
