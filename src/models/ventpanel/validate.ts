import type { z } from "zod"

export interface VentPanelShape {
  width: number
  height: number
  thickness: number
  louvers: number
  louverPitch: number
  slitWidth: number
  louverDepth: number
  holes: number
  holeDiameter: number
  holePitchX: number
  holePitchY: number
}

export function validateVentPanelProps(
  p: VentPanelShape,
  ctx: z.RefinementCtx,
): void {
  if (p.holePitchX + p.holeDiameter >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message: "Corner mounting X hole pitch exceeds vent panel width",
    })
  }
  if (p.holePitchY + p.holeDiameter >= p.height) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchY"],
      message: "Corner mounting Y hole pitch exceeds vent panel height",
    })
  }
  if (p.slitWidth >= p.holePitchX - p.holeDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["slitWidth"],
      message: "Horizontal louver slits collide with corner mounting holes",
    })
  }
  if ((p.louvers - 1) * p.louverPitch >= p.height - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["louvers"],
      message: "Vertical louver stack exceeds vent panel height",
    })
  }
}
