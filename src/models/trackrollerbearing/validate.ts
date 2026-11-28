import type { z } from "zod"

export interface TrackRollerBearingShape {
  boreDiameter: number
  outerDiameter: number
  width: number
  rows: number
  crownRadius: number
  closure: "open" | "shielded" | "sealed"
  boreMount: true
}

export function validateTrackRollerBearingProps(
  p: TrackRollerBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.outerDiameter - 8) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Track roller requires a heavy-section outer ring",
    })
  }
  if (p.crownRadius < p.outerDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["crownRadius"],
      message: "Outer-ring crown radius must be at least the outer diameter",
    })
  }
  if (p.width < 4 * p.rows) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Roller width is too narrow for rolling element rows",
    })
  }
}
