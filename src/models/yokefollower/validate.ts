import type { z } from "zod"

export interface YokeFollowerShape {
  boreDiameter: number
  outerDiameter: number
  width: number
  rows: number
  needleBearing: true
  closure: "open" | "shielded" | "sealed"
  boreMount: true
}

export function validateYokeFollowerProps(
  p: YokeFollowerShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.outerDiameter - 8) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Yoke cam follower requires a thick outer ring section",
    })
  }
  if (p.width < 5 * p.rows) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Yoke follower width is too narrow for needle roller rows",
    })
  }
}
