import type { z } from "zod"

export interface LeadscrewSupportShape {
  boreDiameter: number
  width: number
  height: number
  depth: number
  holePitch: number
  holeDiameter: number
  angularPair: boolean
}

export function validateLeadscrewSupportProps(
  p: LeadscrewSupportShape,
  ctx: z.RefinementCtx,
): void {
  if (p.holePitch + p.holeDiameter > p.width - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Base mounting holes break through support block side walls",
    })
  }
  if (p.boreDiameter >= Math.min(p.width, p.height) - 10) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Bearing bore diameter leaves insufficient housing wall",
    })
  }
}
