import type { z } from "zod"

export interface FixtureJackShape {
  baseDiameter: number
  baseHeight: number
  height: number
  travel: number
  stemDiameter: number
  threadDiameter: number
  threadLength: number
  padDiameter: number
  padThickness: number
}

export function validateFixtureJackProps(
  p: FixtureJackShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.threadDiameter >= p.stemDiameter - 1 ||
    p.stemDiameter >= p.baseDiameter - 8
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["stemDiameter"],
      message:
        "Screw stem diameter must sit between thread bore and base pedestal",
    })
  }
  if (p.travel >= p.height - p.baseHeight - p.padThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["travel"],
      message: "Adjustment travel exceeds jack body envelope",
    })
  }
}
