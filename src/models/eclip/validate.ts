import type { z } from "zod"
import { findDin6799EClipSpec } from "./table"

export interface EClipShape {
  din6799: true
  shaftDiameter: number
  grooveDiameter: number
  free: true
}

export function validateEClipProps(p: EClipShape, ctx: z.RefinementCtx): void {
  const spec = findDin6799EClipSpec(p.grooveDiameter)
  if (!spec) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveDiameter"],
      message: `Unsupported DIN 6799 groove diameter ${p.grooveDiameter} mm`,
    })
    return
  }
  if (p.shaftDiameter <= p.grooveDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["shaftDiameter"],
      message: "Shaft diameter must exceed the retaining groove diameter",
    })
    return
  }
  if (
    p.shaftDiameter < spec.minShaftDiameter - 1e-6 ||
    p.shaftDiameter > spec.maxShaftDiameter + 1e-6
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["shaftDiameter"],
      message: `Shaft diameter ${p.shaftDiameter} mm is outside DIN 6799 range [${spec.minShaftDiameter}, ${spec.maxShaftDiameter}] mm for a ${spec.grooveDiameter} mm groove`,
    })
  }
}
