import type { z } from "zod"

export interface PneumaticFilterShape {
  portNominal: number
  bowlOuterDiameter: number
  height: number
  headWidth: number
  headDepth: number
  holePitch: number
  holes: number
  holeDiameter: number
  bottomDrain: boolean
}

export function validatePneumaticFilterProps(
  p: PneumaticFilterShape,
  ctx: z.RefinementCtx,
): void {
  if (p.bowlOuterDiameter > Math.min(p.headWidth, p.headDepth)) {
    ctx.addIssue({
      code: "custom",
      path: ["bowlOuterDiameter"],
      message:
        "Filter bowl outer diameter cannot exceed manifold head footprint",
    })
  }
  if (p.holePitch + p.holeDiameter > p.headWidth - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Bracket mounting holes break through manifold head width",
    })
  }
}
