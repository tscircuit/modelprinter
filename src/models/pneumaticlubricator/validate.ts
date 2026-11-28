import type { z } from "zod"

export interface PneumaticLubricatorShape {
  portNominal: number
  bowlOuterDiameter: number
  height: number
  headWidth: number
  headDepth: number
  domeOuterDiameter: number
  domeHeight: number
  holePitch: number
  holes: number
  holeDiameter: number
  sightDome: boolean
}

export function validatePneumaticLubricatorProps(
  p: PneumaticLubricatorShape,
  ctx: z.RefinementCtx,
): void {
  if (p.bowlOuterDiameter > Math.min(p.headWidth, p.headDepth)) {
    ctx.addIssue({
      code: "custom",
      path: ["bowlOuterDiameter"],
      message:
        "Reservoir bowl outer diameter cannot exceed manifold head footprint",
    })
  }
  if (p.domeOuterDiameter >= Math.min(p.headWidth, p.headDepth) - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["domeOuterDiameter"],
      message: "Top drip sight dome diameter exceeds upper manifold cap",
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
