import type { z } from "zod"

export interface CableConduitShape {
  outerDiameter: number
  innerDiameter: number
  length: number
  pitch: number
  ribDepth: number
  roundCorrugated: true
}

export function validateCableConduitProps(
  p: CableConduitShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= p.outerDiameter - 2 * p.ribDepth) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Clear bore plus corrugation rib depth must be less than OD",
    })
  }
  if (p.pitch * 2 > p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["pitch"],
      message: "Conduit length must contain at least two corrugation pitches",
    })
  }
}
