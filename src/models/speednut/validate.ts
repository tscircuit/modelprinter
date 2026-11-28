import type { z } from "zod"

export interface SpeedNutShape {
  threadDiameter: number
  width: number
  length: number
  stripThickness: number
  tabs: number
  tabHeight: number
  tabWidth: number
  vBend: true
}

export function validateSpeedNutProps(
  p: SpeedNutShape,
  ctx: z.RefinementCtx,
): void {
  if (p.threadDiameter >= Math.min(p.width, p.length) - 3) {
    ctx.addIssue({
      code: "custom",
      path: ["threadDiameter"],
      message:
        "Screw diameter leaves insufficient rectangular spring strip rim",
    })
  }
  if (p.tabWidth >= p.width - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["tabWidth"],
      message: "Raised V-tab width exceeds spring strip side bridges",
    })
  }
}
