import type { z } from "zod"

export interface CurrentTransformerShape {
  width: number
  height: number
  depth: number
  boreDiameter: number
  terminals: 2
  tabs: 2
  holeDiameter: number
  holePitch: number
  closedRing: true
}

export function validateCurrentTransformerProps(
  p: CurrentTransformerShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= Math.min(p.width, p.height) - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Conductor window bore exceeds toroidal core housing walls",
    })
  }
  if (p.holePitch <= p.width + p.holeDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Side mounting tab hole pitch must clear housing width",
    })
  }
}
