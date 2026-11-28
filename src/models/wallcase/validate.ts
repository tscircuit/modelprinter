import type { z } from "zod"

export interface WallCaseShape {
  width: number
  depth: number
  height: number
  wallThickness: number
  cornerRadius: number
  leftPivotDoor: true
  mounts: number
  holeDiameter: number
  holePitchX: number
  holePitchY: number
}

export function validateWallCaseProps(
  p: WallCaseShape,
  ctx: z.RefinementCtx,
): void {
  if (p.holePitchX + p.holeDiameter >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message: "Rear wall-mounting X hole pitch exceeds cabinet width",
    })
  }
  if (p.holePitchY + p.holeDiameter >= p.height) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchY"],
      message: "Rear wall-mounting Y hole pitch exceeds cabinet height",
    })
  }
  if (p.depth <= 3 * p.wallThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["depth"],
      message: "Wall cabinet depth must exceed shell and door thicknesses",
    })
  }
}
