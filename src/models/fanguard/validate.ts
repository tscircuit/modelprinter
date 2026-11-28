import type { z } from "zod"

export interface FanGuardShape {
  outerDiameter: number
  wireDiameter: number
  rings: number
  ringOuterDiameters: number[]
  spokes: number
  tabs: 4
  holeDiameter: number
  holePitchX: number
  holePitchY: number
}

export function validateFanGuardProps(
  p: FanGuardShape,
  ctx: z.RefinementCtx,
): void {
  if (p.ringOuterDiameters.length !== p.rings) {
    ctx.addIssue({
      code: "custom",
      path: ["ringOuterDiameters"],
      message: "Number of ring outer diameters must match rings count",
    })
    return
  }
  for (let i = 1; i < p.ringOuterDiameters.length; i++) {
    const prev = p.ringOuterDiameters[i - 1]!
    const curr = p.ringOuterDiameters[i]!
    if (curr <= prev + 2 * p.wireDiameter) {
      ctx.addIssue({
        code: "custom",
        path: ["ringOuterDiameters"],
        message: "Concentric wire rings must be strictly increasing with gap",
      })
      return
    }
  }
  const outermost = p.ringOuterDiameters[p.ringOuterDiameters.length - 1]!
  if (Math.abs(outermost - p.outerDiameter) > 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Outermost ring diameter must match guard outerDiameter",
    })
  }
}
