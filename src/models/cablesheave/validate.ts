import type { z } from "zod"

export interface CableSheaveShape {
  outerDiameter: number
  boreDiameter: number
  width: number
  grooveRadius: number
  uGroove: true
  bearingBore: true
  grooveDepth: number
}

export function validateCableSheaveProps(
  p: CableSheaveShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.grooveRadius >= p.width - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveRadius"],
      message: "U-groove width leaves insufficient side flange cheeks",
    })
  }
  if (p.grooveDepth < p.grooveRadius) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveDepth"],
      message: "Deep U-groove depth must be at least equal to groove radius",
    })
  }
  if (p.outerDiameter - 2 * p.grooveDepth <= p.boreDiameter + 6) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveDepth"],
      message: "Groove root diameter collides with central bearing bore",
    })
  }
}
